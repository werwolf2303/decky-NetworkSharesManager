import enum
import json
import os
import shutil
import subprocess
import sys
from random import randint
from io import StringIO
import logging

debug = False

if debug:
    import asyncio

if not debug:
    import decky_plugin


class EventTypes(enum.Enum):
    ERRUSERNAMEPASSWORD = 0  # Username or Password is invalid
    ERRADDRESS = 1  # Share address is invalid
    ERROTHER = 2  # Some unknown error happened


class Events:
    class Event:
        def __init__(self, eventType: EventTypes, events, message: str = ""):
            self.eventType: EventTypes = eventType
            self.message: str = message
            self.eventID: int = randint(1, 10000)
            self.__checkForDuplicates(events)

        def __checkForDuplicates(self, events):
            for event in events:
                if event.eventID == self.eventID:
                    self.eventID = randint(1, 10000)
                    self.__checkForDuplicates(events)
                    break

        def construct(self):
            return {
                "event": {
                    "eventType": self.eventType.value,
                    "message": self.message
                }
            }

    def __init__(self):
        self.events = []

    def getPendingEvents(self):
        jsonObj = [
        ]
        for event in self.events:
            jsonObj.append(event.construct())
            self.removeEvent(event.eventID)
        return jsonObj

    def addEvent(self, eventType: EventTypes, message: str = ""):
        self.events.append(self.Event(eventType, self.events, message))

    def removeEvent(self, eventID: int):
        for event in self.events:
            if event.eventID == eventID:
                self.events.remove(event)
                break


class Settings:
    def __init__(self, directory):
        self.directory = directory
        self.configCache = {
            "shares": [
            ],
            "language": "en",
            "autolanguage": "true",
            "firstTime": "true",
            "version": "0.0.1"
        }
        self.defaultConfig = {
            "shares": [
            ],
            "language": "en",
            "autolanguage": "true",
            "firstTime": "true",
            "version": "0.0.1"
        }
        if not os.path.exists(self.directory + "/config.json"):
            self.__writeConfig()
        else:
            self.configCache = self.__readConfig()

    def refreshConfig(self):
        # When the plugin got updated, check if the default config has the same values as the current one
        for defaultKey in self.defaultConfig.keys():
            if defaultKey not in self.configCache.keys():
                self.configCache[defaultKey] = self.defaultConfig[defaultKey]

    def __writeConfig(self):
        with open(self.directory + '/config.json', 'w') as configFile:
            configFile.write(json.dumps(self.configCache))

    def __readConfig(self):
        with open(self.directory + '/config.json', 'r') as configFile:
            return json.load(configFile)

    def __secureRandomShareID(self):
        secureRandom = randint(1, 999999)
        for share in json.loads(self.getShares()):
            if share["id"] == secureRandom:
                secureRandom = self.__secureRandomShareID()  # Repeat until the random id is unique
        return secureRandom

    def addShare(self, username, password, address, globaladdress, mountingpath, automount):
        self.configCache["shares"].append({
            "username": username,
            "password": password,
            "address": address,
            "globaladdress": globaladdress,
            "mountingpath": mountingpath,
            "automount": automount,
            "id": self.__secureRandomShareID()
        })
        self.__writeConfig()

    def editShare(self, shareID, username, password, address, globaladdress, mountingpath, automount):
        for share in self.configCache["shares"]:
            if share["id"] == shareID:
                share["username"] = username
                share["password"] = password
                share["address"] = address
                share["globaladdress"] = globaladdress
                share["mountingpath"] = mountingpath
                share["automount"] = automount
                self.__writeConfig()

    def removeShare(self, shareId):
        for share in self.configCache["shares"]:
            if share["id"] == shareId:
                self.configCache["shares"].remove(share)
                self.__writeConfig()

    def getSetting(self, key) -> any:
        return self.configCache[key]

    def getShares(self):
        return json.dumps(self.configCache["shares"])

    def setSetting(self, key: str, value):
        self.configCache[key] = value
        self.__writeConfig()

    def removeSetting(self, key: str):
        self.configCache.pop(key)
        self.__writeConfig()


class Plugin:
    def __init__(self):
        self.events = None
        self.settings = None

    async def init(self):
        self.events = Events()
        if not debug: self.settings = Settings(decky_plugin.DECKY_PLUGIN_SETTINGS_DIR)
        if debug: self.settings = Settings(os.path.dirname(os.path.realpath(__file__)) + "/data")
        if not debug: logging.basicConfig(filename=decky_plugin.DECKY_PLUGIN_LOG_DIR + "/python.log",
                                          format="[NetworkSharesManager] %(asctime)s %(levelname)s %(message)s",
                                          filemode="w+",
                                          force=True)

        if debug: logging.basicConfig(filename=os.path.dirname(os.path.realpath(__file__)) + "/data/python.log",
                                      format="[NetworkSharesManager] %(asctime)s %(levelname)s %(message)s",
                                      filemode="w+",
                                      force=True)

    async def getMounts(self):
        try:
            logging.getLogger().info("getMounts called")
            result = subprocess.run(["findmnt", "-Jo", "source,target,fstype,options,use%,used,avail"],
                                    capture_output=True, text=True, check=True)
            logging.getLogger().info("getMounts: " + result.stdout)
            return result.stdout
        except subprocess.CalledProcessError as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e.stderr))
            return "{}"

    async def execute(self, code):
        try:
            logging.getLogger().info("execute called")
            old_stdout = sys.stdout
            redirected_output = sys.stdout = StringIO()
            exec(code)
            sys.stdout = old_stdout
            logging.getLogger().info("execute: " + redirected_output.getvalue())
            return redirected_output.getvalue()
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))
            return ""

    async def rmDir(self, path):
        try:
            logging.getLogger().info("rmDir called")
            shutil.rmtree(path)
            logging.getLogger().info("rmDir: " + path)
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))

    async def mkdir(self, path):
        try:
            logging.getLogger().info("mkdir called")
            os.mkdir(path)
            logging.getLogger().info("mkdir: " + path)
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))

    async def mount(self, username, password, shareaddress, sharepath):
        try:
            logging.getLogger().info("mount called")
            if not os.path.exists(sharepath):
                os.mkdir(sharepath)
            if os.path.ismount(sharepath):
                logging.getLogger().info("mount skipped")
                return
            subprocess.run(["mount", "-t", "cifs", shareaddress, sharepath, "-o",
                            "username=" + username + ",password=" + password + ",uid=" + str(
                                os.getuid()) + ",gid=" + str(os.getgid())], capture_output=True, text=True, check=True)
            logging.getLogger().info("Mounting drive")
        except subprocess.CalledProcessError as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e.stderr))

    async def unmount(self, sharepath):
        try:
            logging.getLogger().info("unmount called")
            shutil.rmtree(sharepath)
            subprocess.run(["umount", sharepath], capture_output=True, text=True, check=True)
            logging.getLogger().info("unmount: " + sharepath)
        except subprocess.CalledProcessError as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e.stderr))

    async def settingsAddShare(self, username, password, address, globaladdress, mountingpath, automount):
        try:
            logging.getLogger().info("settingsAddShare called")
            self.settings.addShare(username, password, address, globaladdress, mountingpath, automount)
            logging.getLogger().info("settingsAddShare: share add exec done")
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))

    async def removeShare(self, shareId):
        try:
            logging.getLogger().info("removeShare called")
            self.settings.removeShare(shareId)
            logging.getLogger().info("removeShare")
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))

    async def setSetting(self, key, value):
        try:
            logging.getLogger().info("setSetting called")
            self.settings.setSetting(key, value)
            logging.getLogger().info("setSettings: key=" + key + " value=" + value)
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))

    async def getSetting(self, key):
        try:
            logging.getLogger().info("getSetting called")
            return self.settings.getSetting(key)
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))
            return ""

    async def getShares(self):
        logging.getLogger().info("getShares")
        return self.settings.getShares()

    async def removeSetting(self, key):
        try:
            logging.getLogger().info("removeSetting called")
            self.settings.removeSetting(key)
            logging.getLogger().info("removeSetting: " + key)
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))

    async def getPendingEvents(self):
        try:
            logging.getLogger().info("getPendingEvents")
            return json.dumps(self.events.getPendingEvents())
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))
            return ""

    async def editShare(self, shareID, username, password, address, globaladdress, mountingpath, automount):
        try:
            logging.getLogger().info("editShare called")
            self.settings.editShare(shareID, username, password, address, globaladdress, mountingpath, automount)
            logging.getLogger().info("editShare")
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))

    async def refreshConfig(self):
        try:
            logging.getLogger().info("refreshConfig called")
            self.settings.refreshConfig()
            logging.getLogger().info("refreshConfig")
        except Exception as e:
            logging.getLogger().error(e)
            self.events.addEvent(EventTypes.ERROTHER, str(e))