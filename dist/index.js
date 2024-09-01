(function (deckyFrontendLib, React) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  var DefaultContext = {
    color: undefined,
    size: undefined,
    className: undefined,
    style: undefined,
    attr: undefined
  };
  var IconContext = React__default["default"].createContext && React__default["default"].createContext(DefaultContext);

  var __assign = window && window.__assign || function () {
    __assign = Object.assign || function (t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __rest = window && window.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };
  function Tree2Element(tree) {
    return tree && tree.map(function (node, i) {
      return React__default["default"].createElement(node.tag, __assign({
        key: i
      }, node.attr), Tree2Element(node.child));
    });
  }
  function GenIcon(data) {
    // eslint-disable-next-line react/display-name
    return function (props) {
      return React__default["default"].createElement(IconBase, __assign({
        attr: __assign({}, data.attr)
      }, props), Tree2Element(data.child));
    };
  }
  function IconBase(props) {
    var elem = function (conf) {
      var attr = props.attr,
        size = props.size,
        title = props.title,
        svgProps = __rest(props, ["attr", "size", "title"]);
      var computedSize = size || conf.size || "1em";
      var className;
      if (conf.className) className = conf.className;
      if (props.className) className = (className ? className + " " : "") + props.className;
      return React__default["default"].createElement("svg", __assign({
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: "0"
      }, conf.attr, attr, svgProps, {
        className: className,
        style: __assign(__assign({
          color: props.color || conf.color
        }, conf.style), props.style),
        height: computedSize,
        width: computedSize,
        xmlns: "http://www.w3.org/2000/svg"
      }), title && React__default["default"].createElement("title", null, title), props.children);
    };
    return IconContext !== undefined ? React__default["default"].createElement(IconContext.Consumer, null, function (conf) {
      return elem(conf);
    }) : elem(DefaultContext);
  }

  // THIS FILE IS AUTO GENERATED
  function FaNetworkWired (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M640 264v-16c0-8.84-7.16-16-16-16H344v-40h72c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32H224c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h72v40H16c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h104v40H64c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V352c0-17.67-14.33-32-32-32h-56v-40h304v40h-56c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V352c0-17.67-14.33-32-32-32h-56v-40h104c8.84 0 16-7.16 16-16zM256 128V64h128v64H256zm-64 320H96v-64h96v64zm352 0h-96v-64h96v64z"}}]})(props);
  }function FaPen (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"}}]})(props);
  }

  class Backend {
      constructor(serverAPI, backendEvents) {
          this.serverAPI = serverAPI;
          this.backendEvents = backendEvents;
      }
      async getPendingBackendEvents() {
          return this.backendEvents.getPendingEvents();
      }
      async init() {
          var bool = (await this.serverAPI.callPluginMethod("init", {})).success;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return bool;
      }
      async getMounts() {
          var ret = (await this.serverAPI.callPluginMethod("getMounts", {})).result;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return ret;
      }
      async execute(code) {
          var ret = (await this.serverAPI.callPluginMethod("execute", { "code": code })).result;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          console.log(this.backendEvents.getPendingEvents());
          return ret;
      }
      async rmDir(path) {
          var bool = (await this.serverAPI.callPluginMethod("rmDir", { "path": path })).success;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return bool;
      }
      async mkdir(path) {
          var bool = (await this.serverAPI.callPluginMethod("mkdir", { "path": path })).success;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return bool;
      }
      async mount(username, password, shareaddress, sharepath) {
          var bool = (await this.serverAPI.callPluginMethod("mount", { "username": username, "password": password, "shareaddress": shareaddress, "sharepath": sharepath })).success;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return bool;
      }
      async unmount(sharepath) {
          var bool = (await this.serverAPI.callPluginMethod("unmount", { "sharepath": sharepath })).success;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return bool;
      }
      async settingsAddShare(username, password, address, globaladdress, mountingpath, automount) {
          var bool = (await this.serverAPI.callPluginMethod("settingsAddShare", { "username": username, "password": password, "address": address, "globaladdress": globaladdress, "mountingpath": mountingpath, "automount": automount })).success;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return bool;
      }
      async settingsEditShare(shareID, username, password, address, globaladdress, mountingpath, automount) {
          var bool = (await this.serverAPI.callPluginMethod("editShare", { "shareID": shareID, "username": username, "password": password, "address": address, "globaladdress": globaladdress, "mountingpath": mountingpath, "automount": automount })).success;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return bool;
      }
      async removeShare(shareId) {
          var bool = (await this.serverAPI.callPluginMethod("removeShare", { "shareId": shareId })).success;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return bool;
      }
      async setSetting(key, value) {
          var bool = (await this.serverAPI.callPluginMethod("setSetting", { "key": key, "value": value })).success;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return bool;
      }
      async getSetting(key) {
          var ret = (await this.serverAPI.callPluginMethod("getSetting", { "key": key })).result;
          console.log(await this.getPendingEvents());
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return ret;
      }
      async getShares() {
          return (await this.serverAPI.callPluginMethod("getShares", {})).result;
      }
      async removeSetting(key) {
          var bool = (await this.serverAPI.callPluginMethod("removeSetting", { "key": key })).success;
          this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
          return bool;
      }
      async getPendingEvents() {
          return (await this.serverAPI.callPluginMethod("getPendingEvents", {})).result;
      }
  }

  function uniqueRandom(min, max, arrayOfNumbers) {
      var random = Math.floor(Math.random() * (max - min + 1)) + min;
      for (let i = 0; i < arrayOfNumbers.length; i++) {
          if (arrayOfNumbers[i] == random) {
              return uniqueRandom(min, max, arrayOfNumbers);
          }
      }
      return random;
  }
  function removeFromArray(arr, value) {
      const index = arr.indexOf(value);
      if (index > -1) {
          arr.splice(index, 1);
      }
      return arr;
  }
  function getLastElement(string, character) {
      return string.split(character)[string.split(character).length - 1];
  }

  var BackendEventTypes;
  (function (BackendEventTypes) {
      BackendEventTypes[BackendEventTypes["ERRUSERNAMEPASSWORD"] = 0] = "ERRUSERNAMEPASSWORD";
      BackendEventTypes[BackendEventTypes["ERRADDRESS"] = 1] = "ERRADDRESS";
      BackendEventTypes[BackendEventTypes["ERROTHER"] = 2] = "ERROTHER"; // Some unknown error happened
  })(BackendEventTypes || (BackendEventTypes = {}));
  class BackendEvent {
      constructor(eventJSON) {
          this.eventType = eventJSON.event.eventType;
          this.message = eventJSON["event"]["message"];
      }
      getEventType() {
          return this.eventType;
      }
      getMessage() {
          return this.message;
      }
  }
  class BackendEvents {
      constructor() {
          this.events = [];
      }
      parse(events) {
          for (let eventObj of events) {
              this.events.push(new BackendEvent(eventObj));
          }
      }
      getPendingEvents() {
          const eventsCopy = this.events.map((event) => event);
          this.events = [];
          return eventsCopy;
      }
  }
  class Event {
      constructor(name) {
          this.subscribers = [];
          this.subscriberIds = [];
          this.name = name;
      }
      trigger(...data) {
          for (let func of this.subscribers) {
              func(data);
          }
      }
      getName() {
          return this.name;
      }
      subscribe(func) {
          this.subscribers.push(func);
          const subscriberId = uniqueRandom(1, 99999, this.subscriberIds);
          this.subscriberIds.push(subscriberId);
          return subscriberId;
      }
      unsubscribe(subscriberId) {
          let counter = -1;
          for (let i = 0; i < this.subscriberIds.length; i++) {
              if (this.subscriberIds[i] == subscriberId) {
                  counter = i;
                  break;
              }
          }
          if (counter == -1)
              return false;
          removeFromArray(this.subscribers, counter);
          removeFromArray(this.subscriberIds, counter);
          return true;
      }
  }
  class Events {
      constructor() {
          this.events = [];
          var errorEvent = new Event("onerror");
          this.events.push(errorEvent);
          var suspendEvent = new Event("onsuspend");
          this.events.push(suspendEvent);
          var onunloadEvent = new Event("onunload");
          this.events.push(onunloadEvent);
          var ondomountedtablerefreshEvent = new Event("ondomountedtablerefresh");
          this.events.push(ondomountedtablerefreshEvent);
          var ondoalltablerefreshEvent = new Event("ondoalltablerefresh");
          this.events.push(ondoalltablerefreshEvent);
          var onresumefromsuspend = new Event("onresumefromsuspend");
          this.events.push(onresumefromsuspend);
          var onconnectivitychange = new Event("onconnectivitychange");
          this.events.push(onconnectivitychange);
      }
      subscribe(func, eventName) {
          for (let i = 0; i < this.events.length; i++) {
              if (this.events[i].getName() == eventName) {
                  return this.events[i].subscribe(func);
              }
          }
          return -1;
      }
      trigger(eventName, ...data) {
          for (let i = 0; i < this.events.length; i++) {
              if (this.events[i].getName() == eventName) {
                  return this.events[i].trigger(data);
              }
          }
      }
      unsubscribe(subscriberId, eventName) {
          for (let i = 0; i < this.events.length; i++) {
              if (this.events[i].getName() == eventName) {
                  return this.events[i].unsubscribe(subscriberId);
              }
          }
          return false;
      }
  }

  class Frontend {
      constructor(events, language) {
          this.version = "0.0.1";
          this.events = events;
          this.language = language;
      }
      getPluginVersion() {
          return this.version;
      }
      getLanguage() {
          return this.language;
      }
      getEvents() {
          return this.events;
      }
  }

  function ErrorView({ frontend, error }) {
      return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
          window.SP_REACT.createElement(deckyFrontendLib.PanelSection, { title: frontend.getLanguage().translate("error.title") },
              window.SP_REACT.createElement("p", null, frontend.getLanguage().translate("error.header")),
              window.SP_REACT.createElement("p", { style: { color: "red" } }, error))));
  }

  const showAddShareModal = (frontend, backend, addressObj = "", globalAddressObj = "", mountingPathObj = "", usernameObj = "", passwordObj = "", automountObj = false, color = "white") => {
      var address = addressObj;
      var globalAddress = globalAddressObj;
      var mountingPath = mountingPathObj;
      var username = usernameObj;
      var password = passwordObj;
      var automount = automountObj;
      function checkInput() {
          var passwordCheck = password != "";
          var usernameCheck = username != "";
          var guestCheck = username.toLowerCase() == "guest";
          if (guestCheck) {
              passwordCheck = true;
          }
          return address != "" && mountingPath != "" && usernameCheck && passwordCheck;
      }
      const { Close } = deckyFrontendLib.showModal(window.SP_REACT.createElement(deckyFrontendLib.ModalRoot, null,
          window.SP_REACT.createElement(deckyFrontendLib.DialogHeader, { style: { color: color }, className: "addShareModalHeader" }, frontend.getLanguage().translate("addshare.title")),
          window.SP_REACT.createElement(deckyFrontendLib.DialogBody, null,
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("addshare.address") },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { onChange: (event) => {
                              address = event.target.value;
                          }, style: { minWidth: "50vw" }, placeholder: "//XXX.XXX.XXX.XXX/Wolf" }))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { disabled: true, label: frontend.getLanguage().translate("addshare.globaladdress") },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { onChange: (event) => {
                              globalAddress = event.target.value;
                          }, style: { minWidth: "40vw" }, placeholder: "//example.com/Wolf" }))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("addshare.mountingpath") },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { onChange: (event) => {
                              mountingPath = event.target.value;
                          }, style: { minWidth: "40vw" }, placeholder: "/home/deck/Wolf" }))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("addshare.username") },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { onChange: (event) => {
                              username = event.target.value;
                          }, style: { minWidth: "50vw" }, placeholder: "walterhorst@example.com" }))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("addshare.password") },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { onChange: (event) => {
                              password = event.target.value;
                          }, style: { minWidth: "50vw" }, placeholder: "verysecurepassword1234" }))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.ToggleField, { bottomSeparator: "standard", checked: false, label: frontend.getLanguage().translate("addshare.automount"), onChange: (checked) => {
                          automount = checked;
                      } })),
              window.SP_REACT.createElement("br", null),
              window.SP_REACT.createElement("br", null),
              window.SP_REACT.createElement("div", { style: {
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "15%"
                  } },
                  window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { onClick: () => {
                          async function doSave() {
                              await backend.settingsAddShare(username, password, address, globalAddress, mountingPath, automount);
                              Close();
                              frontend.getEvents().trigger("ondoalltablerefresh");
                          }
                          var inputCheckResult = checkInput();
                          if (inputCheckResult)
                              doSave();
                          if (!inputCheckResult) {
                              Close();
                              showAddShareModal(frontend, backend, address, globalAddress, mountingPath, username, password, automount, "red");
                          }
                      } }, frontend.getLanguage().translate("addshare.add")),
                  window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { onClick: () => {
                          Close();
                      } }, frontend.getLanguage().translate("addshare.closecancel"))))));
  };

  const showEditShareModal = (frontend, backend, share, color = "white") => {
      var address = share.address;
      var globalAddress = share.globaladdress;
      var mountingPath = share.mountingpath;
      var username = share.username;
      var password = share.password;
      var automount = share.automount;
      function checkInput() {
          var passwordCheck = password != "";
          var usernameCheck = username != "";
          var guestCheck = username.toLowerCase() == "guest";
          if (guestCheck) {
              passwordCheck = true;
          }
          return address != "" && mountingPath != "" && usernameCheck && passwordCheck;
      }
      const { Close } = deckyFrontendLib.showModal(window.SP_REACT.createElement(deckyFrontendLib.ModalRoot, null,
          window.SP_REACT.createElement(deckyFrontendLib.DialogHeader, { style: { color: color }, className: "addShareModalHeader" }, frontend.getLanguage().translate("manageshare.title").replace("%sharename%", getLastElement(address, "/"))),
          window.SP_REACT.createElement(deckyFrontendLib.DialogBody, null,
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("manageshare.address") },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { onChange: (event) => {
                              address = event.target.value;
                          }, style: { minWidth: "50vw" } }))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { disabled: true, label: frontend.getLanguage().translate("manageshare.globaladdress") },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { onChange: (event) => {
                              globalAddress = event.target.value;
                          }, style: { minWidth: "40vw" }, value: globalAddress }))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("manageshare.mountingpath") },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { onChange: (event) => {
                              mountingPath = event.target.value;
                          }, style: { minWidth: "40vw" }, value: mountingPath }))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("manageshare.username") },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { onChange: (event) => {
                              username = event.target.value;
                          }, style: { minWidth: "50vw" }, value: username }))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("manageshare.password") },
                      window.SP_REACT.createElement(deckyFrontendLib.TextField, { onChange: (event) => {
                              password = event.target.value;
                          }, style: { minWidth: "50vw" }, value: password }))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.ToggleField, { bottomSeparator: "standard", checked: automount, label: frontend.getLanguage().translate("manageshare.automount"), onChange: (checked) => {
                          automount = checked;
                      } })),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { onClick: () => {
                          async function remove() {
                              await backend.removeShare(Number.parseInt(share.id));
                              Close();
                              frontend.getEvents().trigger("ondoalltablerefresh");
                          }
                          remove();
                      } }, frontend.getLanguage().translate("manageshare.remove"))),
              window.SP_REACT.createElement("br", null),
              window.SP_REACT.createElement("br", null),
              window.SP_REACT.createElement("div", { style: {
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "15%"
                  } },
                  window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { onClick: () => {
                          async function doSave() {
                              await backend.settingsAddShare(username, password, address, globalAddress, mountingPath, automount);
                              Close();
                              frontend.getEvents().trigger("ondoalltablerefresh");
                          }
                          var inputCheckResult = checkInput();
                          if (inputCheckResult)
                              doSave();
                          if (!inputCheckResult) {
                              Close();
                              showEditShareModal(frontend, backend, share, "red");
                          }
                      } }, frontend.getLanguage().translate("addshare.add")),
                  window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { onClick: () => {
                          Close();
                      } }, frontend.getLanguage().translate("addshare.closecancel"))))));
  };

  // THIS FILE IS AUTO GENERATED
  function GrNetworkDrive (props) {
    return GenIcon({"tag":"svg","attr":{"fill":"none","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"strokeWidth":"2","d":"M12 14v4M22 6v6a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1h18a1 1 0 011 1zM12 21a2 2 0 100-4 2 2 0 000 4zM6 10a1 1 0 100-2 1 1 0 000 2z"}}]})(props);
  }

  function AvailableShares({ backend, frontend }) {
      const [loaded, setLoaded] = React.useState(false);
      const [shares, setShares] = React__default["default"].useState([]);
      async function doReload() {
          setShares(JSON.parse(await backend.getShares()));
      }
      async function load() {
          setShares(JSON.parse(await backend.getShares()));
          frontend.getEvents().subscribe(doReload, "ondoalltablerefresh");
      }
      React__default["default"].useEffect(() => {
          load().then(() => setLoaded(true));
      }, []);
      return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
          !loaded &&
              window.SP_REACT.createElement(deckyFrontendLib.PanelSection, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("general.loading") },
                      window.SP_REACT.createElement(deckyFrontendLib.Spinner, null))),
          loaded && window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
              window.SP_REACT.createElement(deckyFrontendLib.PanelSection, { title: frontend.getLanguage().translate("availableshares.title") },
                  shares.length != 0 && window.SP_REACT.createElement("table", { style: {
                          width: "100%"
                      } },
                      window.SP_REACT.createElement("tr", null,
                          window.SP_REACT.createElement("th", { style: {
                                  fontSize: "12px",
                                  textAlign: "left"
                              } }, frontend.getLanguage().translate("table.column1")),
                          window.SP_REACT.createElement("th", { style: { fontSize: "12px", textAlign: "left" } }, frontend.getLanguage().translate("table.column3")),
                          window.SP_REACT.createElement("th", { style: { fontSize: "12px", textAlign: "left" } }, frontend.getLanguage().translate("availableshares.edit"))),
                      shares.map(share => (window.SP_REACT.createElement("tr", null,
                          window.SP_REACT.createElement("td", null, getLastElement(share["address"], "/")),
                          window.SP_REACT.createElement("td", null,
                              window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { style: {
                                      padding: '10px',
                                      margin: '2px 0px',
                                      minWidth: 'auto'
                                  }, onClick: () => {
                                      async function mount() {
                                          await backend.mount(share.username, share.password, share.address, share.mountingpath);
                                          frontend.getEvents().trigger("ondomountedtablerefresh");
                                      }
                                      mount();
                                  } },
                                  window.SP_REACT.createElement(GrNetworkDrive, null))),
                          window.SP_REACT.createElement("td", null,
                              window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { style: {
                                      padding: '10px',
                                      margin: '2px 0px',
                                      minWidth: 'auto'
                                  }, onClick: () => {
                                      showEditShareModal(frontend, backend, share);
                                  } },
                                  window.SP_REACT.createElement(FaPen, null))))))),
                  shares.length == 0 && window.SP_REACT.createElement("p", null, frontend.getLanguage().translate("table.empty")),
                  window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { style: {
                          width: "90%"
                      }, onClick: () => {
                          showAddShareModal(frontend, backend);
                      } }, frontend.getLanguage().translate("availableshares.addshare.title"))))));
  }

  function MountedShares({ backend, frontend }) {
      const [loaded, setLoaded] = React.useState(false);
      const [shares, setShares] = React__default["default"].useState(null);
      const [cifsCount, setCifsCount] = React__default["default"].useState(0);
      async function doReload() {
          setShares(JSON.parse(await backend.getMounts()));
          let counter = 0;
          shares?.filesystems?.[0]?.children?.map(share => {
              if (share.fstype === "cifs")
                  counter++;
          });
          setCifsCount(counter);
      }
      async function load() {
          setShares(JSON.parse(await backend.getMounts()));
          let counter = 0;
          shares?.filesystems?.[0]?.children?.map(share => {
              if (share.fstype === "cifs")
                  counter++;
          });
          setCifsCount(counter);
          frontend.getEvents().subscribe(doReload, "ondomountedtablerefresh");
      }
      React__default["default"].useEffect(() => {
          load().then(() => setLoaded(true));
      }, []);
      return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
          !loaded &&
              window.SP_REACT.createElement(deckyFrontendLib.PanelSection, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("general.loading") },
                      window.SP_REACT.createElement(deckyFrontendLib.Spinner, null))),
          loaded && window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
              window.SP_REACT.createElement(deckyFrontendLib.PanelSection, { title: frontend.getLanguage().translate("mountedshares.title") },
                  shares != null && cifsCount != 0 && window.SP_REACT.createElement("table", { style: {
                          width: "100%"
                      } },
                      window.SP_REACT.createElement("tr", null,
                          window.SP_REACT.createElement("th", { style: {
                                  fontSize: "12px",
                                  textAlign: "left"
                              } }, frontend.getLanguage().translate("table.column1")),
                          window.SP_REACT.createElement("th", { style: {
                                  fontSize: "12px",
                                  textAlign: "left"
                              } }, frontend.getLanguage().translate("table.column2")),
                          window.SP_REACT.createElement("th", { style: { fontSize: "12px", textAlign: "left" } }, frontend.getLanguage().translate("table.column3"))),
                      shares?.filesystems?.[0]?.children?.map(share => (share.fstype === "cifs" && (window.SP_REACT.createElement("tr", null,
                          window.SP_REACT.createElement("td", null, getLastElement(share.source, "/")),
                          window.SP_REACT.createElement("td", null, getLastElement(share.target, "/")),
                          window.SP_REACT.createElement("td", null,
                              window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { style: {
                                      padding: '10px',
                                      margin: '2px 0px',
                                      minWidth: 'auto'
                                  }, onClick: () => {
                                      async function unmount() {
                                          await backend.unmount(share.target);
                                          frontend.getEvents().trigger("ondomountedtablerefresh");
                                      }
                                      unmount();
                                  } },
                                  window.SP_REACT.createElement(FaPen, null)))))))),
                  shares != null && cifsCount == 0 && window.SP_REACT.createElement("p", null, frontend.getLanguage().translate("table.empty"))))));
  }

  function OverView({ backend, frontend }) {
      return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
          window.SP_REACT.createElement(MountedShares, { backend: backend, frontend: frontend }),
          window.SP_REACT.createElement(AvailableShares, { backend: backend, frontend: frontend })));
  }

  function MainView({ backend, frontend }) {
      const [loaded, setLoaded] = React__default["default"].useState(false);
      const [error, setError] = React__default["default"].useState("");
      const [errorState, setErrorState] = React__default["default"].useState(false);
      function onError(...data) {
          setError(data[0]);
          setErrorState(true);
      }
      async function onSuspend() {
          var mounts = JSON.parse(await backend.getMounts());
          mounts?.filesystems?.[0]?.children?.map(share => {
              if (share.fstype === "cifs") {
                  backend.unmount(share.target);
              }
          });
      }
      async function onResumeFromSuspend() {
          var shares = JSON.parse(await backend.getShares());
          shares.map((share) => {
              if (share.automount) {
                  backend.mount(share.username, share.password, share.address, share.mountingpath);
              }
          });
      }
      async function onConnectivityTestChange(connectivityTestChange) {
          if (connectivityTestChange.eConnectivityTestResult == 5) {
              onSuspend();
          }
          if (connectivityTestChange.eConnectivityTestResult == 1) {
              var shares = JSON.parse(await backend.getShares());
              var mounts = JSON.parse(await backend.getMounts());
              mounts?.filesystems?.[0]?.children?.map(mount => {
                  if (mount.fstype === "cifs") {
                      if (connectivityTestChange == 1) {
                          shares.map((share) => {
                              if (share.automount && share.mountingpath == mount.target) {
                                  backend.mount(share.username, share.password, share.address, share.mountingpath);
                              }
                          });
                      }
                  }
              });
          }
      }
      async function load() {
          await backend.init();
          await frontend.getLanguage().init();
          frontend.getEvents().subscribe(onError, "onerror");
          frontend.getEvents().subscribe(onSuspend, "onsuspend");
          frontend.getEvents().subscribe(onResumeFromSuspend, "onresumefromsuspend");
          frontend.getEvents().subscribe(onConnectivityTestChange, "onconnectivitychange");
      }
      React__default["default"].useEffect(() => {
          load().then(() => setLoaded(true));
      }, []);
      return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
          !loaded &&
              window.SP_REACT.createElement(deckyFrontendLib.PanelSection, null,
                  window.SP_REACT.createElement(deckyFrontendLib.Field, { label: frontend.getLanguage().translate("general.loading") },
                      window.SP_REACT.createElement(deckyFrontendLib.Spinner, null))),
          loaded && errorState && window.SP_REACT.createElement(ErrorView, { error: error, frontend: frontend }),
          loaded && !errorState && window.SP_REACT.createElement(OverView, { backend: backend, frontend: frontend })));
  }

  var english = {
  	"general.loading": "Loading...",
  	"error.title": "Error",
  	"error.header": "An internal error occurred",
  	"table.column1": "Share name",
  	"table.column2": "Directory name",
  	"table.column3": "Mount",
  	"table.empty": "No shares",
  	"mountedshares.title": "Mounted shares",
  	"availableshares.title": "Available shares",
  	"availableshares.addshare.title": "Add share",
  	"availableshares.edit": "Edit",
  	"addshare.title": "Add share",
  	"addshare.address": "Share address:",
  	"addshare.globaladdress": "Global share address:",
  	"addshare.mountingpath": "Share mounting path:",
  	"addshare.username": "Username:",
  	"addshare.password": "Password:",
  	"addshare.automount": "Auto mount",
  	"addshare.add": "Add",
  	"addshare.closecancel": "Close (Cancel)",
  	"manageshare.title": "Manage %sharename%",
  	"manageshare.address": "Share address:",
  	"manageshare.globaladdress": "Global share address:",
  	"manageshare.mountingpath": "Share mounting path:",
  	"manageshare.username": "Username:",
  	"manageshare.password": "Password:",
  	"manageshare.automount": "Auto mount",
  	"manageshare.remove": "Remove share",
  	"manageshare.apply": "Apply",
  	"manageshare.closecancel": "Close (Cancel)"
  };

  class LanguageDefinition {
      constructor(code, fullName, handle) {
          this.code = code;
          this.fullName = fullName;
          this.handle = handle;
      }
  }
  class Language {
      constructor(backend) {
          this.language = {
              translate(name) {
                  return name;
              }
          };
          this.availableLanguages = [
              new LanguageDefinition("en", "English", english),
          ];
          this.backend = backend;
      }
      async init() {
          var found = false;
          var selectedLangauge = await this.backend.getSetting("language");
          var upper = this;
          var autodetect = Boolean(await this.backend.getSetting("autolanguage"));
          for (var language of this.availableLanguages) {
              if (autodetect) {
                  if (language.code === navigator.language.split("-")[0].toLocaleLowerCase()) {
                      found = true;
                      this.language = {
                          translate(name) {
                              return language.handle[name];
                          }
                      };
                      return;
                  }
              }
              else {
                  if (language.code === selectedLangauge) {
                      found = true;
                      upper.language = {
                          translate(name) {
                              return language.handle[name];
                          }
                      };
                      return;
                  }
              }
          }
          if (!found) {
              var en = this.availableLanguages[0];
              this.language = {
                  translate(name) {
                      return en.handle[name];
                  }
              };
          }
      }
      translate(name) {
          return this.language.translate(name);
      }
      getAvailableLanguages() {
          return this.availableLanguages;
      }
  }

  var index = deckyFrontendLib.definePlugin((serverApi) => {
      var backend = new Backend(serverApi, new BackendEvents());
      var frontend = new Frontend(new Events(), new Language(backend));
      const { unregister: unregisterOnSuspendRequest } = SteamClient.System.RegisterForOnSuspendRequest(async () => {
          frontend.getEvents().trigger("onsuspend");
      });
      const { unregister: unregisterOnResumeFromSuspend } = SteamClient.System.RegisterForOnResumeFromSuspend(async () => {
          frontend.getEvents().trigger("onresumefromsuspend");
      });
      const { unregister: unregisterConnectivityTestChanges } = SteamClient.System.Network.RegisterForConnectivityTestChanges(async (connectivityTestChange) => {
          frontend.getEvents().trigger("onconnectivitychange", connectivityTestChange);
      });
      return {
          title: window.SP_REACT.createElement("div", { className: deckyFrontendLib.staticClasses.Title }, "Network Shares Manager"),
          content: window.SP_REACT.createElement(MainView, { frontend: frontend, backend: backend }),
          icon: window.SP_REACT.createElement(FaNetworkWired, null),
          onDismount() {
              frontend.getEvents().trigger("onunload");
              unregisterOnSuspendRequest();
              unregisterOnResumeFromSuspend();
              unregisterConnectivityTestChanges();
          }
      };
  });

  return index;

})(DFL, SP_REACT);
