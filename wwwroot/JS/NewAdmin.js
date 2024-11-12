/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminMemberHub: () => (/* binding */ AdminMemberHub)
/* harmony export */ });
/* harmony import */ var _Items_Member_AdminMember__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _LinksHubs_MemberLinkHub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(48);
/* harmony import */ var _AdminBaseHub__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(49);
/* harmony import */ var _Elements_Forms_MemberForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(51);
/* harmony import */ var _LinksHubs_TeamLinkHub__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);






class AdminMemberHub extends _AdminBaseHub__WEBPACK_IMPORTED_MODULE_3__.AdminBaseHub {
    MemberHub;
    TeamHub;
    Form = new _Elements_Forms_MemberForm__WEBPACK_IMPORTED_MODULE_4__.MemberForm();
    constructor(wrapper, memberForm) {
        super(wrapper, memberForm);
        wrapper.append(this.Form.Element);
        this.Form.Submit = async (form) => {
            return await this.MemberHub.CreateMember(form.FirstName.value, form.LastName.value, form.Team.Select.ID == 0 ? undefined : form.Team.Select.ID);
        };
        this.Form.IsDuplicate = () => {
            console.log(this.Items.some((m) => m.FirstName == this.Form.FirstName.value && m.LastName == this.Form.LastName.value));
            return this.Items.some((m) => {
                m.FirstName == this.Form.FirstName.value && m.LastName == this.Form.LastName.value;
            });
        };
        this.MemberHub = _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_1__.HubFactory.GetInstance(_LinksHubs_MemberLinkHub__WEBPACK_IMPORTED_MODULE_2__.AdminMemberLinkHub);
        this.MemberHub.OnCreate((linkItem) => this.CreateItem(linkItem));
        this.MemberHub.OnUpdate((item) => {
            const member = this.Items.get(item.id);
            if (!member)
                return;
            member.FirstName = item.firstName;
            member.LastName = item.lastName;
            member.Present = item.present;
            member.TeamID = item.sdTeam_ID ?? 0;
        });
        this.MemberHub.OnDelete((member) => {
            this.Items.delete(member.id);
        });
        this.TeamHub = _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_1__.HubFactory.GetInstance(_LinksHubs_TeamLinkHub__WEBPACK_IMPORTED_MODULE_5__.AdminTeamLinkHub);
        this.TeamHub.OnCreate((team) => this.Form.Team.Select.CreateOption(team.id, team.name));
        this.TeamHub.OnUpdate((team) => this.Form.Team.Select.UpdateOption(team.id, team.name));
        this.TeamHub.OnDelete((team) => this.Form.Team.Select.DeleteOption(team.id));
    }
    ConstructItem = (item) => {
        const member = new _Items_Member_AdminMember__WEBPACK_IMPORTED_MODULE_0__.AdminMember(item, this.MemberHub.UpdateMember, this.MemberHub.DeleteMember);
        return member;
    };
}


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminMember: () => (/* binding */ AdminMember)
/* harmony export */ });
/* harmony import */ var _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _LinksHubs_TeamLinkHub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _Elements_Member_AdminMemberCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40);
/* harmony import */ var _BaseMember__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(46);




class AdminMember extends _BaseMember__WEBPACK_IMPORTED_MODULE_3__.BaseMember {
    Card = new _Elements_Member_AdminMemberCard__WEBPACK_IMPORTED_MODULE_2__.AdminMemberCard();
    TeamLinkHub;
    _Update;
    _Delete;
    constructor(item, updateM, deleteM) {
        super(item);
        this.FirstName = item.firstName;
        this.LastName = item.lastName;
        this.Present = item.present;
        if (item.sdTeam_ID)
            this.TeamID = item.sdTeam_ID;
        this.Card.PresentUpdate = () => {
            this.Update();
            this.Card.PresentCheck = !this.Card.PresentCheck;
        };
        this._Update = updateM;
        this._Delete = deleteM;
        this.Card.Element.append(this.Card.NameWrapper, this.Card.Admin.EditButton, this.Card.PresentWrapper, this.Card.TeamWrapper, this.Card.Admin.DeleteButton);
        this.Card.Admin.ExtendConfirmBefore = () => this.Card.FirstNameInput.value !== "" && this.Card.LastNameInput.value !== "";
        this.Card.Update = this.Update;
        this.Card.Delete = this.Delete;
        this.Card.Admin.ToggleInputVis = () => {
            this.Card.Admin.ToggleAppend(this.Card.FirstNameInput, this.Card.NameWrapper);
            this.Card.Admin.ToggleAppend(this.Card.LastNameInput, this.Card.NameWrapper);
            this.Card.Admin.ToggleAppend(this.Card.NameSpan, this.Card.NameWrapper);
        };
        this.Card.Admin.ToggleInput = () => {
            this.Card.Admin.ToggleDisabled(this.Card.FirstNameInput);
            this.Card.Admin.ToggleDisabled(this.Card.LastNameInput);
        };
        this.TeamLinkHub = _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_0__.HubFactory.GetInstance(_LinksHubs_TeamLinkHub__WEBPACK_IMPORTED_MODULE_1__.AdminTeamLinkHub);
        this.TeamLinkHub.OnCreate((team) => {
            this.Card.Team.CreateOption(team.id, team.name);
        });
    }
    CreateTeamOption = (id, text) => {
        this.Card.Team.CreateOption(id, text);
    };
    Update = async () => {
        return await this._Update(this.ID, this.Card.PresentCheck, this.Card.FirstNameInput.value, this.Card.LastNameInput.value, this.Card.Team.ID);
    };
    Delete = async () => {
        return await this._Delete(this.ID);
    };
    get FirstName() {
        return super.FirstName;
    }
    set FirstName(name) {
        super.FirstName = name;
        this.Card.FirstNameInput.value = name;
    }
    get LastName() {
        return super.LastName;
    }
    set LastName(name) {
        super.LastName = name;
        this.Card.LastNameInput.value = name;
    }
    set TeamID(id) {
        super.TeamID = id;
        this.Card.Team.ID = id;
    }
}


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HubFactory: () => (/* binding */ HubFactory)
/* harmony export */ });
class HubFactory {
    static Hubs = new Map();
    static GetInstance(type) {
        const typeName = type.name;
        if (!HubFactory.Hubs.has(typeName)) {
            HubFactory.Hubs.set(typeName, new type());
        }
        return HubFactory.Hubs.get(typeName);
    }
}


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminTeamLinkHub: () => (/* binding */ AdminTeamLinkHub)
/* harmony export */ });
/* harmony import */ var _AdminBaseLinkHub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);

class AdminTeamLinkHub extends _AdminBaseLinkHub__WEBPACK_IMPORTED_MODULE_0__.AdminBaseLinkHub {
    constructor() {
        super("TeamHub");
        this.ServerReview = this.ReviewTeam;
    }
    CreateTeam = (team) => {
        return this.Hub.Create(team.Name);
    };
    ReviewTeam = (teams) => {
        for (const team of teams) {
            for (const cb of this.CreateCB)
                cb(team);
            this.IC.Add(team);
        }
    };
    UpdateTeam = (...arg) => {
        return this.Hub.Update(...arg);
    };
    DeleteTeam = (...arg) => {
        return this.Hub.Delete(...arg);
    };
}
// export class TeamLinkHub extends BaseLinkHub<Team> {}


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminBaseLinkHub: () => (/* binding */ AdminBaseLinkHub)
/* harmony export */ });
/* harmony import */ var _AdminSignalRHub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _BaseLinkHub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(38);


class AdminBaseLinkHub extends _BaseLinkHub__WEBPACK_IMPORTED_MODULE_1__.BaseLinkHub {
    constructor(hubName) {
        super(hubName);
    }
    CreateHub(hubName) {
        return new _AdminSignalRHub__WEBPACK_IMPORTED_MODULE_0__.AdminSignalRHub(hubName);
    }
}


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminSignalRHub: () => (/* binding */ AdminSignalRHub)
/* harmony export */ });
/* harmony import */ var _microsoft_signalr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);
/* harmony import */ var _microsoft_signalr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22);
/* harmony import */ var _BaseSignalRHub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
//#region Imports


//#endregion
class AdminSignalRHub extends _BaseSignalRHub__WEBPACK_IMPORTED_MODULE_0__.BaseSignalRHub {
    Connection;
    constructor(name) {
        const connection = new _microsoft_signalr__WEBPACK_IMPORTED_MODULE_1__.HubConnectionBuilder().withUrl(`/${name}`).withAutomaticReconnect().configureLogging(_microsoft_signalr__WEBPACK_IMPORTED_MODULE_2__.LogLevel.None).build();
        super(name, connection);
        this.Connection = connection;
    }
    //#region Invoke server
    Create = (...arg) => {
        return this.Connection.invoke("Create", ...arg);
    };
    Update = (...arg) => {
        return this.Connection.invoke("Update", ...arg);
    };
    Delete = (...arg) => {
        return this.Connection.invoke("Delete", ...arg);
    };
}


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseSignalRHub: () => (/* binding */ BaseSignalRHub)
/* harmony export */ });
/* harmony import */ var _microsoft_signalr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);
/* harmony import */ var _microsoft_signalr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22);
//#region Imports

//#endregion
class BaseSignalRHub {
    //#region Props
    Connection;
    Ready = false;
    ServerCreate;
    _ServerReview;
    ServerUpdate;
    ServerDelete;
    //#endregion
    constructor(name, altConnection) {
        const connection = altConnection ? altConnection : new _microsoft_signalr__WEBPACK_IMPORTED_MODULE_0__.HubConnectionBuilder().withUrl(`/${name}`).withAutomaticReconnect().configureLogging(_microsoft_signalr__WEBPACK_IMPORTED_MODULE_1__.LogLevel.None).build();
        //#region Connection handlers
        connection.start().then(() => {
            connection.invoke("Connect");
            this.Ready = true;
            this.Review();
        });
        connection.onreconnecting((error) => {
            console.warn(`Connection lost due to error "${error}". Reconnecting...`);
        });
        connection.onreconnected((connectionId) => {
            console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`);
        });
        connection.onclose((error) => {
            console.error(`Connection closed due to error "${error}". Attempting to restart connection...`);
            this.startConnection(this.Connection);
        });
        window.addEventListener("beforeunload", () => {
            connection.stop().catch((err) => console.error(err.toString()));
        });
        //#endregion
        this.Connection = connection;
        //#region Server responses
        connection.on("Create", (arg) => {
            this.ServerCreate?.(arg);
        });
        connection.on("Review", (arg) => {
            this._ServerReview?.(arg);
        });
        connection.on("Update", (arg) => {
            this.ServerUpdate?.(arg);
        });
        connection.on("Delete", (arg) => {
            this.ServerDelete?.(arg);
        });
        //#endregion
    }
    startConnection = async (connection) => {
        try {
            connection.start().then(() => {
                connection.invoke("Connect");
            });
        }
        catch (err) {
            console.error("SignalR connection error: ", err);
            setTimeout(() => this.startConnection(this.Connection), 5000);
        }
        while (true) {
            // Infinite loop for continuous retry
            try {
                await connection.start();
                console.log("Reconnected successfully!");
                break; // Exit loop when reconnected
            }
            catch (err) {
                console.log("Reconnect attempt failed. Retrying in 5 seconds...", err);
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
            }
        }
    };
    Review = () => {
        this.Connection.invoke("Review");
    };
    get ServerReview() {
        return this._ServerReview;
    }
    set ServerReview(func) {
        this._ServerReview = func;
        if (this.Ready)
            this.Review();
    }
}


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HubConnectionBuilder: () => (/* binding */ HubConnectionBuilder)
/* harmony export */ });
/* harmony import */ var _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(14);
/* harmony import */ var _HttpConnection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15);
/* harmony import */ var _HubConnection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(31);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(37);
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(24);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.







const LogLevelNameMapping = {
    trace: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace,
    debug: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug,
    info: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information,
    information: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information,
    warn: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning,
    warning: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning,
    error: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error,
    critical: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Critical,
    none: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.None,
};
function parseLogLevel(name) {
    // Case-insensitive matching via lower-casing
    // Yes, I know case-folding is a complicated problem in Unicode, but we only support
    // the ASCII strings defined in LogLevelNameMapping anyway, so it's fine -anurse.
    const mapping = LogLevelNameMapping[name.toLowerCase()];
    if (typeof mapping !== "undefined") {
        return mapping;
    }
    else {
        throw new Error(`Unknown log level: ${name}`);
    }
}
/** A builder for configuring {@link @microsoft/signalr.HubConnection} instances. */
class HubConnectionBuilder {
    configureLogging(logging) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(logging, "logging");
        if (isLogger(logging)) {
            this.logger = logging;
        }
        else if (typeof logging === "string") {
            const logLevel = parseLogLevel(logging);
            this.logger = new _Utils__WEBPACK_IMPORTED_MODULE_1__.ConsoleLogger(logLevel);
        }
        else {
            this.logger = new _Utils__WEBPACK_IMPORTED_MODULE_1__.ConsoleLogger(logging);
        }
        return this;
    }
    withUrl(url, transportTypeOrOptions) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isNotEmpty(url, "url");
        this.url = url;
        // Flow-typing knows where it's at. Since HttpTransportType is a number and IHttpConnectionOptions is guaranteed
        // to be an object, we know (as does TypeScript) this comparison is all we need to figure out which overload was called.
        if (typeof transportTypeOrOptions === "object") {
            this.httpConnectionOptions = { ...this.httpConnectionOptions, ...transportTypeOrOptions };
        }
        else {
            this.httpConnectionOptions = {
                ...this.httpConnectionOptions,
                transport: transportTypeOrOptions,
            };
        }
        return this;
    }
    /** Configures the {@link @microsoft/signalr.HubConnection} to use the specified Hub Protocol.
     *
     * @param {IHubProtocol} protocol The {@link @microsoft/signalr.IHubProtocol} implementation to use.
     */
    withHubProtocol(protocol) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(protocol, "protocol");
        this.protocol = protocol;
        return this;
    }
    withAutomaticReconnect(retryDelaysOrReconnectPolicy) {
        if (this.reconnectPolicy) {
            throw new Error("A reconnectPolicy has already been set.");
        }
        if (!retryDelaysOrReconnectPolicy) {
            this.reconnectPolicy = new _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__.DefaultReconnectPolicy();
        }
        else if (Array.isArray(retryDelaysOrReconnectPolicy)) {
            this.reconnectPolicy = new _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__.DefaultReconnectPolicy(retryDelaysOrReconnectPolicy);
        }
        else {
            this.reconnectPolicy = retryDelaysOrReconnectPolicy;
        }
        return this;
    }
    /** Configures {@link @microsoft/signalr.HubConnection.serverTimeoutInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
     *
     * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
     */
    withServerTimeout(milliseconds) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(milliseconds, "milliseconds");
        this._serverTimeoutInMilliseconds = milliseconds;
        return this;
    }
    /** Configures {@link @microsoft/signalr.HubConnection.keepAliveIntervalInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
     *
     * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
     */
    withKeepAliveInterval(milliseconds) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(milliseconds, "milliseconds");
        this._keepAliveIntervalInMilliseconds = milliseconds;
        return this;
    }
    /** Enables and configures options for the Stateful Reconnect feature.
     *
     * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
     */
    withStatefulReconnect(options) {
        if (this.httpConnectionOptions === undefined) {
            this.httpConnectionOptions = {};
        }
        this.httpConnectionOptions._useStatefulReconnect = true;
        this._statefulReconnectBufferSize = options === null || options === void 0 ? void 0 : options.bufferSize;
        return this;
    }
    /** Creates a {@link @microsoft/signalr.HubConnection} from the configuration options specified in this builder.
     *
     * @returns {HubConnection} The configured {@link @microsoft/signalr.HubConnection}.
     */
    build() {
        // If httpConnectionOptions has a logger, use it. Otherwise, override it with the one
        // provided to configureLogger
        const httpConnectionOptions = this.httpConnectionOptions || {};
        // If it's 'null', the user **explicitly** asked for null, don't mess with it.
        if (httpConnectionOptions.logger === undefined) {
            // If our logger is undefined or null, that's OK, the HttpConnection constructor will handle it.
            httpConnectionOptions.logger = this.logger;
        }
        // Now create the connection
        if (!this.url) {
            throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
        }
        const connection = new _HttpConnection__WEBPACK_IMPORTED_MODULE_3__.HttpConnection(this.url, httpConnectionOptions);
        return _HubConnection__WEBPACK_IMPORTED_MODULE_4__.HubConnection.create(connection, this.logger || _Loggers__WEBPACK_IMPORTED_MODULE_5__.NullLogger.instance, this.protocol || new _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_6__.JsonHubProtocol(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
    }
}
function isLogger(logger) {
    return logger.log !== undefined;
}
//# sourceMappingURL=HubConnectionBuilder.js.map

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultReconnectPolicy: () => (/* binding */ DefaultReconnectPolicy)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// 0, 2, 10, 30 second delays before reconnect attempts.
const DEFAULT_RETRY_DELAYS_IN_MILLISECONDS = [0, 2000, 10000, 30000, null];
/** @private */
class DefaultReconnectPolicy {
    constructor(retryDelays) {
        this._retryDelays = retryDelays !== undefined ? [...retryDelays, null] : DEFAULT_RETRY_DELAYS_IN_MILLISECONDS;
    }
    nextRetryDelayInMilliseconds(retryContext) {
        return this._retryDelays[retryContext.previousRetryCount];
    }
}
//# sourceMappingURL=DefaultReconnectPolicy.js.map

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpConnection: () => (/* binding */ HttpConnection),
/* harmony export */   TransportSendQueue: () => (/* binding */ TransportSendQueue)
/* harmony export */ });
/* harmony import */ var _AccessTokenHttpClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16);
/* harmony import */ var _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(20);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(22);
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(26);
/* harmony import */ var _LongPollingTransport__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(27);
/* harmony import */ var _ServerSentEventsTransport__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(29);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
/* harmony import */ var _WebSocketTransport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(30);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.









const MAX_REDIRECTS = 100;
/** @private */
class HttpConnection {
    constructor(url, options = {}) {
        this._stopPromiseResolver = () => { };
        this.features = {};
        this._negotiateVersion = 1;
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        this._logger = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.createLogger)(options.logger);
        this.baseUrl = this._resolveUrl(url);
        options = options || {};
        options.logMessageContent = options.logMessageContent === undefined ? false : options.logMessageContent;
        if (typeof options.withCredentials === "boolean" || options.withCredentials === undefined) {
            options.withCredentials = options.withCredentials === undefined ? true : options.withCredentials;
        }
        else {
            throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");
        }
        options.timeout = options.timeout === undefined ? 100 * 1000 : options.timeout;
        let webSocketModule = null;
        let eventSourceModule = null;
        if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && "function" !== "undefined") {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            webSocketModule = requireFunc("ws");
            eventSourceModule = requireFunc("eventsource");
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && typeof WebSocket !== "undefined" && !options.WebSocket) {
            options.WebSocket = WebSocket;
        }
        else if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && !options.WebSocket) {
            if (webSocketModule) {
                options.WebSocket = webSocketModule;
            }
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && typeof EventSource !== "undefined" && !options.EventSource) {
            options.EventSource = EventSource;
        }
        else if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && !options.EventSource) {
            if (typeof eventSourceModule !== "undefined") {
                options.EventSource = eventSourceModule;
            }
        }
        this._httpClient = new _AccessTokenHttpClient__WEBPACK_IMPORTED_MODULE_1__.AccessTokenHttpClient(options.httpClient || new _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_2__.DefaultHttpClient(this._logger), options.accessTokenFactory);
        this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
        this._connectionStarted = false;
        this._options = options;
        this.onreceive = null;
        this.onclose = null;
    }
    async start(transferFormat) {
        transferFormat = transferFormat || _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat.Binary;
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Starting connection with transfer format '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[transferFormat]}'.`);
        if (this._connectionState !== "Disconnected" /* ConnectionState.Disconnected */) {
            return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
        }
        this._connectionState = "Connecting" /* ConnectionState.Connecting */;
        this._startInternalPromise = this._startInternal(transferFormat);
        await this._startInternalPromise;
        // The TypeScript compiler thinks that connectionState must be Connecting here. The TypeScript compiler is wrong.
        if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
            // stop() was called and transitioned the client into the Disconnecting state.
            const message = "Failed to start the HttpConnection before stop() was called.";
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, message);
            // We cannot await stopPromise inside startInternal since stopInternal awaits the startInternalPromise.
            await this._stopPromise;
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError(message));
        }
        else if (this._connectionState !== "Connected" /* ConnectionState.Connected */) {
            // stop() was called and transitioned the client into the Disconnecting state.
            const message = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, message);
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError(message));
        }
        this._connectionStarted = true;
    }
    send(data) {
        if (this._connectionState !== "Connected" /* ConnectionState.Connected */) {
            return Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State."));
        }
        if (!this._sendQueue) {
            this._sendQueue = new TransportSendQueue(this.transport);
        }
        // Transport will not be null if state is connected
        return this._sendQueue.send(data);
    }
    async stop(error) {
        if (this._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnected state.`);
            return Promise.resolve();
        }
        if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
            return this._stopPromise;
        }
        this._connectionState = "Disconnecting" /* ConnectionState.Disconnecting */;
        this._stopPromise = new Promise((resolve) => {
            // Don't complete stop() until stopConnection() completes.
            this._stopPromiseResolver = resolve;
        });
        // stopInternal should never throw so just observe it.
        await this._stopInternal(error);
        await this._stopPromise;
    }
    async _stopInternal(error) {
        // Set error as soon as possible otherwise there is a race between
        // the transport closing and providing an error and the error from a close message
        // We would prefer the close message error.
        this._stopError = error;
        try {
            await this._startInternalPromise;
        }
        catch (e) {
            // This exception is returned to the user as a rejected Promise from the start method.
        }
        // The transport's onclose will trigger stopConnection which will run our onclose event.
        // The transport should always be set if currently connected. If it wasn't set, it's likely because
        // stop was called during start() and start() failed.
        if (this.transport) {
            try {
                await this.transport.stop();
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `HttpConnection.transport.stop() threw error '${e}'.`);
                this._stopConnection();
            }
            this.transport = undefined;
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
        }
    }
    async _startInternal(transferFormat) {
        // Store the original base url and the access token factory since they may change
        // as part of negotiating
        let url = this.baseUrl;
        this._accessTokenFactory = this._options.accessTokenFactory;
        this._httpClient._accessTokenFactory = this._accessTokenFactory;
        try {
            if (this._options.skipNegotiation) {
                if (this._options.transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets) {
                    // No need to add a connection ID in this case
                    this.transport = this._constructTransport(_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets);
                    // We should just call connect directly in this case.
                    // No fallback or negotiate in this case.
                    await this._startTransport(url, transferFormat);
                }
                else {
                    throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");
                }
            }
            else {
                let negotiateResponse = null;
                let redirects = 0;
                do {
                    negotiateResponse = await this._getNegotiationResponse(url);
                    // the user tries to stop the connection when it is being started
                    if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */ || this._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
                        throw new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError("The connection was stopped during negotiation.");
                    }
                    if (negotiateResponse.error) {
                        throw new Error(negotiateResponse.error);
                    }
                    if (negotiateResponse.ProtocolVersion) {
                        throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
                    }
                    if (negotiateResponse.url) {
                        url = negotiateResponse.url;
                    }
                    if (negotiateResponse.accessToken) {
                        // Replace the current access token factory with one that uses
                        // the returned access token
                        const accessToken = negotiateResponse.accessToken;
                        this._accessTokenFactory = () => accessToken;
                        // set the factory to undefined so the AccessTokenHttpClient won't retry with the same token, since we know it won't change until a connection restart
                        this._httpClient._accessToken = accessToken;
                        this._httpClient._accessTokenFactory = undefined;
                    }
                    redirects++;
                } while (negotiateResponse.url && redirects < MAX_REDIRECTS);
                if (redirects === MAX_REDIRECTS && negotiateResponse.url) {
                    throw new Error("Negotiate redirection limit exceeded.");
                }
                await this._createTransport(url, this._options.transport, negotiateResponse, transferFormat);
            }
            if (this.transport instanceof _LongPollingTransport__WEBPACK_IMPORTED_MODULE_6__.LongPollingTransport) {
                this.features.inherentKeepAlive = true;
            }
            if (this._connectionState === "Connecting" /* ConnectionState.Connecting */) {
                // Ensure the connection transitions to the connected state prior to completing this.startInternalPromise.
                // start() will handle the case when stop was called and startInternal exits still in the disconnecting state.
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, "The HttpConnection connected successfully.");
                this._connectionState = "Connected" /* ConnectionState.Connected */;
            }
            // stop() is waiting on us via this.startInternalPromise so keep this.transport around so it can clean up.
            // This is the only case startInternal can exit in neither the connected nor disconnected state because stopConnection()
            // will transition to the disconnected state. start() will wait for the transition using the stopPromise.
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, "Failed to start the connection: " + e);
            this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
            this.transport = undefined;
            // if start fails, any active calls to stop assume that start will complete the stop promise
            this._stopPromiseResolver();
            return Promise.reject(e);
        }
    }
    async _getNegotiationResponse(url) {
        const headers = {};
        const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
        headers[name] = value;
        const negotiateUrl = this._resolveNegotiateUrl(url);
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Sending negotiation request: ${negotiateUrl}.`);
        try {
            const response = await this._httpClient.post(negotiateUrl, {
                content: "",
                headers: { ...headers, ...this._options.headers },
                timeout: this._options.timeout,
                withCredentials: this._options.withCredentials,
            });
            if (response.statusCode !== 200) {
                return Promise.reject(new Error(`Unexpected status code returned from negotiate '${response.statusCode}'`));
            }
            const negotiateResponse = JSON.parse(response.content);
            if (!negotiateResponse.negotiateVersion || negotiateResponse.negotiateVersion < 1) {
                // Negotiate version 0 doesn't use connectionToken
                // So we set it equal to connectionId so all our logic can use connectionToken without being aware of the negotiate version
                negotiateResponse.connectionToken = negotiateResponse.connectionId;
            }
            if (negotiateResponse.useStatefulReconnect && this._options._useStatefulReconnect !== true) {
                return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.FailedToNegotiateWithServerError("Client didn't negotiate Stateful Reconnect but the server did."));
            }
            return negotiateResponse;
        }
        catch (e) {
            let errorMessage = "Failed to complete negotiation with the server: " + e;
            if (e instanceof _Errors__WEBPACK_IMPORTED_MODULE_5__.HttpError) {
                if (e.statusCode === 404) {
                    errorMessage = errorMessage + " Either this is not a SignalR endpoint or there is a proxy blocking the connection.";
                }
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, errorMessage);
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.FailedToNegotiateWithServerError(errorMessage));
        }
    }
    _createConnectUrl(url, connectionToken) {
        if (!connectionToken) {
            return url;
        }
        return url + (url.indexOf("?") === -1 ? "?" : "&") + `id=${connectionToken}`;
    }
    async _createTransport(url, requestedTransport, negotiateResponse, requestedTransferFormat) {
        let connectUrl = this._createConnectUrl(url, negotiateResponse.connectionToken);
        if (this._isITransport(requestedTransport)) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, "Connection was provided an instance of ITransport, using that directly.");
            this.transport = requestedTransport;
            await this._startTransport(connectUrl, requestedTransferFormat);
            this.connectionId = negotiateResponse.connectionId;
            return;
        }
        const transportExceptions = [];
        const transports = negotiateResponse.availableTransports || [];
        let negotiate = negotiateResponse;
        for (const endpoint of transports) {
            const transportOrError = this._resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat, (negotiate === null || negotiate === void 0 ? void 0 : negotiate.useStatefulReconnect) === true);
            if (transportOrError instanceof Error) {
                // Store the error and continue, we don't want to cause a re-negotiate in these cases
                transportExceptions.push(`${endpoint.transport} failed:`);
                transportExceptions.push(transportOrError);
            }
            else if (this._isITransport(transportOrError)) {
                this.transport = transportOrError;
                if (!negotiate) {
                    try {
                        negotiate = await this._getNegotiationResponse(url);
                    }
                    catch (ex) {
                        return Promise.reject(ex);
                    }
                    connectUrl = this._createConnectUrl(url, negotiate.connectionToken);
                }
                try {
                    await this._startTransport(connectUrl, requestedTransferFormat);
                    this.connectionId = negotiate.connectionId;
                    return;
                }
                catch (ex) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `Failed to start the transport '${endpoint.transport}': ${ex}`);
                    negotiate = undefined;
                    transportExceptions.push(new _Errors__WEBPACK_IMPORTED_MODULE_5__.FailedToStartTransportError(`${endpoint.transport} failed: ${ex}`, _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[endpoint.transport]));
                    if (this._connectionState !== "Connecting" /* ConnectionState.Connecting */) {
                        const message = "Failed to select transport before stop() was called.";
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, message);
                        return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError(message));
                    }
                }
            }
        }
        if (transportExceptions.length > 0) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AggregateErrors(`Unable to connect to the server with any of the available transports. ${transportExceptions.join(" ")}`, transportExceptions));
        }
        return Promise.reject(new Error("None of the transports supported by the client are supported by the server."));
    }
    _constructTransport(transport) {
        switch (transport) {
            case _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets:
                if (!this._options.WebSocket) {
                    throw new Error("'WebSocket' is not supported in your environment.");
                }
                return new _WebSocketTransport__WEBPACK_IMPORTED_MODULE_7__.WebSocketTransport(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
            case _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.ServerSentEvents:
                if (!this._options.EventSource) {
                    throw new Error("'EventSource' is not supported in your environment.");
                }
                return new _ServerSentEventsTransport__WEBPACK_IMPORTED_MODULE_8__.ServerSentEventsTransport(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
            case _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.LongPolling:
                return new _LongPollingTransport__WEBPACK_IMPORTED_MODULE_6__.LongPollingTransport(this._httpClient, this._logger, this._options);
            default:
                throw new Error(`Unknown transport: ${transport}.`);
        }
    }
    _startTransport(url, transferFormat) {
        this.transport.onreceive = this.onreceive;
        if (this.features.reconnect) {
            this.transport.onclose = async (e) => {
                let callStop = false;
                if (this.features.reconnect) {
                    try {
                        this.features.disconnected();
                        await this.transport.connect(url, transferFormat);
                        await this.features.resend();
                    }
                    catch {
                        callStop = true;
                    }
                }
                else {
                    this._stopConnection(e);
                    return;
                }
                if (callStop) {
                    this._stopConnection(e);
                }
            };
        }
        else {
            this.transport.onclose = (e) => this._stopConnection(e);
        }
        return this.transport.connect(url, transferFormat);
    }
    _resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat, useStatefulReconnect) {
        const transport = _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[endpoint.transport];
        if (transport === null || transport === undefined) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
            return new Error(`Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
        }
        else {
            if (transportMatches(requestedTransport, transport)) {
                const transferFormats = endpoint.transferFormats.map((s) => _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[s]);
                if (transferFormats.indexOf(requestedTransferFormat) >= 0) {
                    if ((transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets && !this._options.WebSocket) ||
                        (transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.ServerSentEvents && !this._options.EventSource)) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' because it is not supported in your environment.'`);
                        return new _Errors__WEBPACK_IMPORTED_MODULE_5__.UnsupportedTransportError(`'${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' is not supported in your environment.`, transport);
                    }
                    else {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Selecting transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}'.`);
                        try {
                            this.features.reconnect = transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets ? useStatefulReconnect : undefined;
                            return this._constructTransport(transport);
                        }
                        catch (ex) {
                            return ex;
                        }
                    }
                }
                else {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' because it does not support the requested transfer format '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[requestedTransferFormat]}'.`);
                    return new Error(`'${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' does not support ${_ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[requestedTransferFormat]}.`);
                }
            }
            else {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' because it was disabled by the client.`);
                return new _Errors__WEBPACK_IMPORTED_MODULE_5__.DisabledTransportError(`'${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' is disabled by the client.`, transport);
            }
        }
    }
    _isITransport(transport) {
        return transport && typeof (transport) === "object" && "connect" in transport;
    }
    _stopConnection(error) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `HttpConnection.stopConnection(${error}) called while in state ${this._connectionState}.`);
        this.transport = undefined;
        // If we have a stopError, it takes precedence over the error from the transport
        error = this._stopError || error;
        this._stopError = undefined;
        if (this._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is already in the disconnected state.`);
            return;
        }
        if (this._connectionState === "Connecting" /* ConnectionState.Connecting */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Warning, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is still in the connecting state.`);
            throw new Error(`HttpConnection.stopConnection(${error}) was called while the connection is still in the connecting state.`);
        }
        if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
            // A call to stop() induced this call to stopConnection and needs to be completed.
            // Any stop() awaiters will be scheduled to continue after the onclose callback fires.
            this._stopPromiseResolver();
        }
        if (error) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `Connection disconnected with error '${error}'.`);
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, "Connection disconnected.");
        }
        if (this._sendQueue) {
            this._sendQueue.stop().catch((e) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `TransportSendQueue.stop() threw error '${e}'.`);
            });
            this._sendQueue = undefined;
        }
        this.connectionId = undefined;
        this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
        if (this._connectionStarted) {
            this._connectionStarted = false;
            try {
                if (this.onclose) {
                    this.onclose(error);
                }
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `HttpConnection.onclose(${error}) threw error '${e}'.`);
            }
        }
    }
    _resolveUrl(url) {
        // startsWith is not supported in IE
        if (url.lastIndexOf("https://", 0) === 0 || url.lastIndexOf("http://", 0) === 0) {
            return url;
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isBrowser) {
            throw new Error(`Cannot resolve '${url}'.`);
        }
        // Setting the url to the href propery of an anchor tag handles normalization
        // for us. There are 3 main cases.
        // 1. Relative path normalization e.g "b" -> "http://localhost:5000/a/b"
        // 2. Absolute path normalization e.g "/a/b" -> "http://localhost:5000/a/b"
        // 3. Networkpath reference normalization e.g "//localhost:5000/a/b" -> "http://localhost:5000/a/b"
        const aTag = window.document.createElement("a");
        aTag.href = url;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, `Normalizing '${url}' to '${aTag.href}'.`);
        return aTag.href;
    }
    _resolveNegotiateUrl(url) {
        const negotiateUrl = new URL(url);
        if (negotiateUrl.pathname.endsWith('/')) {
            negotiateUrl.pathname += "negotiate";
        }
        else {
            negotiateUrl.pathname += "/negotiate";
        }
        const searchParams = new URLSearchParams(negotiateUrl.searchParams);
        if (!searchParams.has("negotiateVersion")) {
            searchParams.append("negotiateVersion", this._negotiateVersion.toString());
        }
        if (searchParams.has("useStatefulReconnect")) {
            if (searchParams.get("useStatefulReconnect") === "true") {
                this._options._useStatefulReconnect = true;
            }
        }
        else if (this._options._useStatefulReconnect === true) {
            searchParams.append("useStatefulReconnect", "true");
        }
        negotiateUrl.search = searchParams.toString();
        return negotiateUrl.toString();
    }
}
function transportMatches(requestedTransport, actualTransport) {
    return !requestedTransport || ((actualTransport & requestedTransport) !== 0);
}
/** @private */
class TransportSendQueue {
    constructor(_transport) {
        this._transport = _transport;
        this._buffer = [];
        this._executing = true;
        this._sendBufferedData = new PromiseSource();
        this._transportResult = new PromiseSource();
        this._sendLoopPromise = this._sendLoop();
    }
    send(data) {
        this._bufferData(data);
        if (!this._transportResult) {
            this._transportResult = new PromiseSource();
        }
        return this._transportResult.promise;
    }
    stop() {
        this._executing = false;
        this._sendBufferedData.resolve();
        return this._sendLoopPromise;
    }
    _bufferData(data) {
        if (this._buffer.length && typeof (this._buffer[0]) !== typeof (data)) {
            throw new Error(`Expected data to be of type ${typeof (this._buffer)} but was of type ${typeof (data)}`);
        }
        this._buffer.push(data);
        this._sendBufferedData.resolve();
    }
    async _sendLoop() {
        while (true) {
            await this._sendBufferedData.promise;
            if (!this._executing) {
                if (this._transportResult) {
                    this._transportResult.reject("Connection stopped.");
                }
                break;
            }
            this._sendBufferedData = new PromiseSource();
            const transportResult = this._transportResult;
            this._transportResult = undefined;
            const data = typeof (this._buffer[0]) === "string" ?
                this._buffer.join("") :
                TransportSendQueue._concatBuffers(this._buffer);
            this._buffer.length = 0;
            try {
                await this._transport.send(data);
                transportResult.resolve();
            }
            catch (error) {
                transportResult.reject(error);
            }
        }
    }
    static _concatBuffers(arrayBuffers) {
        const totalLength = arrayBuffers.map((b) => b.byteLength).reduce((a, b) => a + b);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const item of arrayBuffers) {
            result.set(new Uint8Array(item), offset);
            offset += item.byteLength;
        }
        return result.buffer;
    }
}
class PromiseSource {
    constructor() {
        this.promise = new Promise((resolve, reject) => [this._resolver, this._rejecter] = [resolve, reject]);
    }
    resolve() {
        this._resolver();
    }
    reject(reason) {
        this._rejecter(reason);
    }
}
//# sourceMappingURL=HttpConnection.js.map

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccessTokenHttpClient: () => (/* binding */ AccessTokenHttpClient)
/* harmony export */ });
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(17);
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class AccessTokenHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(innerClient, accessTokenFactory) {
        super();
        this._innerClient = innerClient;
        this._accessTokenFactory = accessTokenFactory;
    }
    async send(request) {
        let allowRetry = true;
        if (this._accessTokenFactory && (!this._accessToken || (request.url && request.url.indexOf("/negotiate?") > 0))) {
            // don't retry if the request is a negotiate or if we just got a potentially new token from the access token factory
            allowRetry = false;
            this._accessToken = await this._accessTokenFactory();
        }
        this._setAuthorizationHeader(request);
        const response = await this._innerClient.send(request);
        if (allowRetry && response.statusCode === 401 && this._accessTokenFactory) {
            this._accessToken = await this._accessTokenFactory();
            this._setAuthorizationHeader(request);
            return await this._innerClient.send(request);
        }
        return response;
    }
    _setAuthorizationHeader(request) {
        if (!request.headers) {
            request.headers = {};
        }
        if (this._accessToken) {
            request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_1__.HeaderNames.Authorization] = `Bearer ${this._accessToken}`;
        }
        // don't remove the header if there isn't an access token factory, the user manually added the header in this case
        else if (this._accessTokenFactory) {
            if (request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_1__.HeaderNames.Authorization]) {
                delete request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_1__.HeaderNames.Authorization];
            }
        }
    }
    getCookieString(url) {
        return this._innerClient.getCookieString(url);
    }
}
//# sourceMappingURL=AccessTokenHttpClient.js.map

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeaderNames: () => (/* binding */ HeaderNames)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
class HeaderNames {
}
HeaderNames.Authorization = "Authorization";
HeaderNames.Cookie = "Cookie";
//# sourceMappingURL=HeaderNames.js.map

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpClient: () => (/* binding */ HttpClient),
/* harmony export */   HttpResponse: () => (/* binding */ HttpResponse)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Represents an HTTP response. */
class HttpResponse {
    constructor(statusCode, statusText, content) {
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.content = content;
    }
}
/** Abstraction over an HTTP client.
 *
 * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
 */
class HttpClient {
    get(url, options) {
        return this.send({
            ...options,
            method: "GET",
            url,
        });
    }
    post(url, options) {
        return this.send({
            ...options,
            method: "POST",
            url,
        });
    }
    delete(url, options) {
        return this.send({
            ...options,
            method: "DELETE",
            url,
        });
    }
    /** Gets all cookies that apply to the specified URL.
     *
     * @param url The URL that the cookies are valid for.
     * @returns {string} A string containing all the key-value cookie pairs for the specified URL.
     */
    // @ts-ignore
    getCookieString(url) {
        return "";
    }
}
//# sourceMappingURL=HttpClient.js.map

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultHttpClient: () => (/* binding */ DefaultHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(20);
/* harmony import */ var _FetchHttpClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(21);
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23);
/* harmony import */ var _XhrHttpClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(25);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





/** Default implementation of {@link @microsoft/signalr.HttpClient}. */
class DefaultHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    /** Creates a new instance of the {@link @microsoft/signalr.DefaultHttpClient}, using the provided {@link @microsoft/signalr.ILogger} to log messages. */
    constructor(logger) {
        super();
        if (typeof fetch !== "undefined" || _Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode) {
            this._httpClient = new _FetchHttpClient__WEBPACK_IMPORTED_MODULE_2__.FetchHttpClient(logger);
        }
        else if (typeof XMLHttpRequest !== "undefined") {
            this._httpClient = new _XhrHttpClient__WEBPACK_IMPORTED_MODULE_3__.XhrHttpClient(logger);
        }
        else {
            throw new Error("No usable HttpClient found.");
        }
    }
    /** @inheritDoc */
    send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_4__.AbortError());
        }
        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }
        return this._httpClient.send(request);
    }
    getCookieString(url) {
        return this._httpClient.getCookieString(url);
    }
}
//# sourceMappingURL=DefaultHttpClient.js.map

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError),
/* harmony export */   AggregateErrors: () => (/* binding */ AggregateErrors),
/* harmony export */   DisabledTransportError: () => (/* binding */ DisabledTransportError),
/* harmony export */   FailedToNegotiateWithServerError: () => (/* binding */ FailedToNegotiateWithServerError),
/* harmony export */   FailedToStartTransportError: () => (/* binding */ FailedToStartTransportError),
/* harmony export */   HttpError: () => (/* binding */ HttpError),
/* harmony export */   TimeoutError: () => (/* binding */ TimeoutError),
/* harmony export */   UnsupportedTransportError: () => (/* binding */ UnsupportedTransportError)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Error thrown when an HTTP request fails. */
class HttpError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.HttpError}.
     *
     * @param {string} errorMessage A descriptive error message.
     * @param {number} statusCode The HTTP status code represented by this error.
     */
    constructor(errorMessage, statusCode) {
        const trueProto = new.target.prototype;
        super(`${errorMessage}: Status code '${statusCode}'`);
        this.statusCode = statusCode;
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when a timeout elapses. */
class TimeoutError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.TimeoutError}.
     *
     * @param {string} errorMessage A descriptive error message.
     */
    constructor(errorMessage = "A timeout occurred.") {
        const trueProto = new.target.prototype;
        super(errorMessage);
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when an action is aborted. */
class AbortError extends Error {
    /** Constructs a new instance of {@link AbortError}.
     *
     * @param {string} errorMessage A descriptive error message.
     */
    constructor(errorMessage = "An abort occurred.") {
        const trueProto = new.target.prototype;
        super(errorMessage);
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport is unsupported by the browser. */
/** @private */
class UnsupportedTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.UnsupportedTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'UnsupportedTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport is disabled by the browser. */
/** @private */
class DisabledTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.DisabledTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'DisabledTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport cannot be started. */
/** @private */
class FailedToStartTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.FailedToStartTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'FailedToStartTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the negotiation with the server failed to complete. */
/** @private */
class FailedToNegotiateWithServerError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.FailedToNegotiateWithServerError}.
     *
     * @param {string} message A descriptive error message.
     */
    constructor(message) {
        const trueProto = new.target.prototype;
        super(message);
        this.errorType = 'FailedToNegotiateWithServerError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when multiple errors have occurred. */
/** @private */
class AggregateErrors extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.AggregateErrors}.
     *
     * @param {string} message A descriptive error message.
     * @param {Error[]} innerErrors The collection of errors this error is aggregating.
     */
    constructor(message, innerErrors) {
        const trueProto = new.target.prototype;
        super(message);
        this.innerErrors = innerErrors;
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
//# sourceMappingURL=Errors.js.map

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FetchHttpClient: () => (/* binding */ FetchHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(20);
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(22);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




class FetchHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(logger) {
        super();
        this._logger = logger;
        // Node added a fetch implementation to the global scope starting in v18.
        // We need to add a cookie jar in node to be able to share cookies with WebSocket
        if (typeof fetch === "undefined" || _Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode) {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            // Cookies aren't automatically handled in Node so we need to add a CookieJar to preserve cookies across requests
            this._jar = new (requireFunc("tough-cookie")).CookieJar();
            if (typeof fetch === "undefined") {
                this._fetchType = requireFunc("node-fetch");
            }
            else {
                // Use fetch from Node if available
                this._fetchType = fetch;
            }
            // node-fetch doesn't have a nice API for getting and setting cookies
            // fetch-cookie will wrap a fetch implementation with a default CookieJar or a provided one
            this._fetchType = requireFunc("fetch-cookie")(this._fetchType, this._jar);
        }
        else {
            this._fetchType = fetch.bind((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getGlobalThis)());
        }
        if (typeof AbortController === "undefined") {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            // Node needs EventListener methods on AbortController which our custom polyfill doesn't provide
            this._abortControllerType = requireFunc("abort-controller");
        }
        else {
            this._abortControllerType = AbortController;
        }
    }
    /** @inheritDoc */
    async send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            throw new _Errors__WEBPACK_IMPORTED_MODULE_2__.AbortError();
        }
        if (!request.method) {
            throw new Error("No method defined.");
        }
        if (!request.url) {
            throw new Error("No url defined.");
        }
        const abortController = new this._abortControllerType();
        let error;
        // Hook our abortSignal into the abort controller
        if (request.abortSignal) {
            request.abortSignal.onabort = () => {
                abortController.abort();
                error = new _Errors__WEBPACK_IMPORTED_MODULE_2__.AbortError();
            };
        }
        // If a timeout has been passed in, setup a timeout to call abort
        // Type needs to be any to fit window.setTimeout and NodeJS.setTimeout
        let timeoutId = null;
        if (request.timeout) {
            const msTimeout = request.timeout;
            timeoutId = setTimeout(() => {
                abortController.abort();
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Timeout from HTTP request.`);
                error = new _Errors__WEBPACK_IMPORTED_MODULE_2__.TimeoutError();
            }, msTimeout);
        }
        if (request.content === "") {
            request.content = undefined;
        }
        if (request.content) {
            // Explicitly setting the Content-Type header for React Native on Android platform.
            request.headers = request.headers || {};
            if ((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer)(request.content)) {
                request.headers["Content-Type"] = "application/octet-stream";
            }
            else {
                request.headers["Content-Type"] = "text/plain;charset=UTF-8";
            }
        }
        let response;
        try {
            response = await this._fetchType(request.url, {
                body: request.content,
                cache: "no-cache",
                credentials: request.withCredentials === true ? "include" : "same-origin",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    ...request.headers,
                },
                method: request.method,
                mode: "cors",
                redirect: "follow",
                signal: abortController.signal,
            });
        }
        catch (e) {
            if (error) {
                throw error;
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Error from HTTP request. ${e}.`);
            throw e;
        }
        finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = null;
            }
        }
        if (!response.ok) {
            const errorMessage = await deserializeContent(response, "text");
            throw new _Errors__WEBPACK_IMPORTED_MODULE_2__.HttpError(errorMessage || response.statusText, response.status);
        }
        const content = deserializeContent(response, request.responseType);
        const payload = await content;
        return new _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpResponse(response.status, response.statusText, payload);
    }
    getCookieString(url) {
        let cookies = "";
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode && this._jar) {
            // @ts-ignore: unused variable
            this._jar.getCookies(url, (e, c) => cookies = c.join("; "));
        }
        return cookies;
    }
}
function deserializeContent(response, responseType) {
    let content;
    switch (responseType) {
        case "arraybuffer":
            content = response.arrayBuffer();
            break;
        case "text":
            content = response.text();
            break;
        case "blob":
        case "document":
        case "json":
            throw new Error(`${responseType} is not supported.`);
        default:
            content = response.text();
            break;
    }
    return content;
}
//# sourceMappingURL=FetchHttpClient.js.map

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogLevel: () => (/* binding */ LogLevel)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// These values are designed to match the ASP.NET Log Levels since that's the pattern we're emulating here.
/** Indicates the severity of a log message.
 *
 * Log Levels are ordered in increasing severity. So `Debug` is more severe than `Trace`, etc.
 */
var LogLevel;
(function (LogLevel) {
    /** Log level for very low severity diagnostic messages. */
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    /** Log level for low severity diagnostic messages. */
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    /** Log level for informational diagnostic messages. */
    LogLevel[LogLevel["Information"] = 2] = "Information";
    /** Log level for diagnostic messages that indicate a non-fatal problem. */
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    /** Log level for diagnostic messages that indicate a failure in the current operation. */
    LogLevel[LogLevel["Error"] = 4] = "Error";
    /** Log level for diagnostic messages that indicate a failure that will terminate the entire application. */
    LogLevel[LogLevel["Critical"] = 5] = "Critical";
    /** The highest possible log level. Used when configuring logging to indicate that no log messages should be emitted. */
    LogLevel[LogLevel["None"] = 6] = "None";
})(LogLevel || (LogLevel = {}));
//# sourceMappingURL=ILogger.js.map

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Arg: () => (/* binding */ Arg),
/* harmony export */   ConsoleLogger: () => (/* binding */ ConsoleLogger),
/* harmony export */   Platform: () => (/* binding */ Platform),
/* harmony export */   SubjectSubscription: () => (/* binding */ SubjectSubscription),
/* harmony export */   VERSION: () => (/* binding */ VERSION),
/* harmony export */   constructUserAgent: () => (/* binding */ constructUserAgent),
/* harmony export */   createLogger: () => (/* binding */ createLogger),
/* harmony export */   formatArrayBuffer: () => (/* binding */ formatArrayBuffer),
/* harmony export */   getDataDetail: () => (/* binding */ getDataDetail),
/* harmony export */   getErrorString: () => (/* binding */ getErrorString),
/* harmony export */   getGlobalThis: () => (/* binding */ getGlobalThis),
/* harmony export */   getUserAgentHeader: () => (/* binding */ getUserAgentHeader),
/* harmony export */   isArrayBuffer: () => (/* binding */ isArrayBuffer),
/* harmony export */   sendMessage: () => (/* binding */ sendMessage)
/* harmony export */ });
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


// Version token that will be replaced by the prepack command
/** The version of the SignalR client. */
const VERSION = "8.0.7";
/** @private */
class Arg {
    static isRequired(val, name) {
        if (val === null || val === undefined) {
            throw new Error(`The '${name}' argument is required.`);
        }
    }
    static isNotEmpty(val, name) {
        if (!val || val.match(/^\s*$/)) {
            throw new Error(`The '${name}' argument should not be empty.`);
        }
    }
    static isIn(val, values, name) {
        // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
        if (!(val in values)) {
            throw new Error(`Unknown ${name} value: ${val}.`);
        }
    }
}
/** @private */
class Platform {
    // react-native has a window but no document so we should check both
    static get isBrowser() {
        return !Platform.isNode && typeof window === "object" && typeof window.document === "object";
    }
    // WebWorkers don't have a window object so the isBrowser check would fail
    static get isWebWorker() {
        return !Platform.isNode && typeof self === "object" && "importScripts" in self;
    }
    // react-native has a window but no document
    static get isReactNative() {
        return !Platform.isNode && typeof window === "object" && typeof window.document === "undefined";
    }
    // Node apps shouldn't have a window object, but WebWorkers don't either
    // so we need to check for both WebWorker and window
    static get isNode() {
        return typeof process !== "undefined" && process.release && process.release.name === "node";
    }
}
/** @private */
function getDataDetail(data, includeContent) {
    let detail = "";
    if (isArrayBuffer(data)) {
        detail = `Binary data of length ${data.byteLength}`;
        if (includeContent) {
            detail += `. Content: '${formatArrayBuffer(data)}'`;
        }
    }
    else if (typeof data === "string") {
        detail = `String data of length ${data.length}`;
        if (includeContent) {
            detail += `. Content: '${data}'`;
        }
    }
    return detail;
}
/** @private */
function formatArrayBuffer(data) {
    const view = new Uint8Array(data);
    // Uint8Array.map only supports returning another Uint8Array?
    let str = "";
    view.forEach((num) => {
        const pad = num < 16 ? "0" : "";
        str += `0x${pad}${num.toString(16)} `;
    });
    // Trim of trailing space.
    return str.substr(0, str.length - 1);
}
// Also in signalr-protocol-msgpack/Utils.ts
/** @private */
function isArrayBuffer(val) {
    return val && typeof ArrayBuffer !== "undefined" &&
        (val instanceof ArrayBuffer ||
            // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
            (val.constructor && val.constructor.name === "ArrayBuffer"));
}
/** @private */
async function sendMessage(logger, transportName, httpClient, url, content, options) {
    const headers = {};
    const [name, value] = getUserAgentHeader();
    headers[name] = value;
    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace, `(${transportName} transport) sending data. ${getDataDetail(content, options.logMessageContent)}.`);
    const responseType = isArrayBuffer(content) ? "arraybuffer" : "text";
    const response = await httpClient.post(url, {
        content,
        headers: { ...headers, ...options.headers },
        responseType,
        timeout: options.timeout,
        withCredentials: options.withCredentials,
    });
    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace, `(${transportName} transport) request complete. Response status: ${response.statusCode}.`);
}
/** @private */
function createLogger(logger) {
    if (logger === undefined) {
        return new ConsoleLogger(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information);
    }
    if (logger === null) {
        return _Loggers__WEBPACK_IMPORTED_MODULE_1__.NullLogger.instance;
    }
    if (logger.log !== undefined) {
        return logger;
    }
    return new ConsoleLogger(logger);
}
/** @private */
class SubjectSubscription {
    constructor(subject, observer) {
        this._subject = subject;
        this._observer = observer;
    }
    dispose() {
        const index = this._subject.observers.indexOf(this._observer);
        if (index > -1) {
            this._subject.observers.splice(index, 1);
        }
        if (this._subject.observers.length === 0 && this._subject.cancelCallback) {
            this._subject.cancelCallback().catch((_) => { });
        }
    }
}
/** @private */
class ConsoleLogger {
    constructor(minimumLogLevel) {
        this._minLevel = minimumLogLevel;
        this.out = console;
    }
    log(logLevel, message) {
        if (logLevel >= this._minLevel) {
            const msg = `[${new Date().toISOString()}] ${_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel[logLevel]}: ${message}`;
            switch (logLevel) {
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Critical:
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error:
                    this.out.error(msg);
                    break;
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning:
                    this.out.warn(msg);
                    break;
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information:
                    this.out.info(msg);
                    break;
                default:
                    // console.debug only goes to attached debuggers in Node, so we use console.log for Trace and Debug
                    this.out.log(msg);
                    break;
            }
        }
    }
}
/** @private */
function getUserAgentHeader() {
    let userAgentHeaderName = "X-SignalR-User-Agent";
    if (Platform.isNode) {
        userAgentHeaderName = "User-Agent";
    }
    return [userAgentHeaderName, constructUserAgent(VERSION, getOsName(), getRuntime(), getRuntimeVersion())];
}
/** @private */
function constructUserAgent(version, os, runtime, runtimeVersion) {
    // Microsoft SignalR/[Version] ([Detailed Version]; [Operating System]; [Runtime]; [Runtime Version])
    let userAgent = "Microsoft SignalR/";
    const majorAndMinor = version.split(".");
    userAgent += `${majorAndMinor[0]}.${majorAndMinor[1]}`;
    userAgent += ` (${version}; `;
    if (os && os !== "") {
        userAgent += `${os}; `;
    }
    else {
        userAgent += "Unknown OS; ";
    }
    userAgent += `${runtime}`;
    if (runtimeVersion) {
        userAgent += `; ${runtimeVersion}`;
    }
    else {
        userAgent += "; Unknown Runtime Version";
    }
    userAgent += ")";
    return userAgent;
}
// eslint-disable-next-line spaced-comment
/*#__PURE__*/ function getOsName() {
    if (Platform.isNode) {
        switch (process.platform) {
            case "win32":
                return "Windows NT";
            case "darwin":
                return "macOS";
            case "linux":
                return "Linux";
            default:
                return process.platform;
        }
    }
    else {
        return "";
    }
}
// eslint-disable-next-line spaced-comment
/*#__PURE__*/ function getRuntimeVersion() {
    if (Platform.isNode) {
        return process.versions.node;
    }
    return undefined;
}
function getRuntime() {
    if (Platform.isNode) {
        return "NodeJS";
    }
    else {
        return "Browser";
    }
}
/** @private */
function getErrorString(e) {
    if (e.stack) {
        return e.stack;
    }
    else if (e.message) {
        return e.message;
    }
    return `${e}`;
}
/** @private */
function getGlobalThis() {
    // globalThis is semi-new and not available in Node until v12
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof __webpack_require__.g !== "undefined") {
        return __webpack_require__.g;
    }
    throw new Error("could not find global");
}
//# sourceMappingURL=Utils.js.map

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NullLogger: () => (/* binding */ NullLogger)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** A logger that does nothing when log messages are sent to it. */
class NullLogger {
    constructor() { }
    /** @inheritDoc */
    // eslint-disable-next-line
    log(_logLevel, _message) {
    }
}
/** The singleton instance of the {@link @microsoft/signalr.NullLogger}. */
NullLogger.instance = new NullLogger();
//# sourceMappingURL=Loggers.js.map

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XhrHttpClient: () => (/* binding */ XhrHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(20);
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(22);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(23);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




class XhrHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(logger) {
        super();
        this._logger = logger;
    }
    /** @inheritDoc */
    send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.AbortError());
        }
        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(request.method, request.url, true);
            xhr.withCredentials = request.withCredentials === undefined ? true : request.withCredentials;
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            if (request.content === "") {
                request.content = undefined;
            }
            if (request.content) {
                // Explicitly setting the Content-Type header for React Native on Android platform.
                if ((0,_Utils__WEBPACK_IMPORTED_MODULE_2__.isArrayBuffer)(request.content)) {
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                }
                else {
                    xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                }
            }
            const headers = request.headers;
            if (headers) {
                Object.keys(headers)
                    .forEach((header) => {
                    xhr.setRequestHeader(header, headers[header]);
                });
            }
            if (request.responseType) {
                xhr.responseType = request.responseType;
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = () => {
                    xhr.abort();
                    reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.AbortError());
                };
            }
            if (request.timeout) {
                xhr.timeout = request.timeout;
            }
            xhr.onload = () => {
                if (request.abortSignal) {
                    request.abortSignal.onabort = null;
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(new _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
                }
                else {
                    reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.HttpError(xhr.response || xhr.responseText || xhr.statusText, xhr.status));
                }
            };
            xhr.onerror = () => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Error from HTTP request. ${xhr.status}: ${xhr.statusText}.`);
                reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.HttpError(xhr.statusText, xhr.status));
            };
            xhr.ontimeout = () => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Timeout from HTTP request.`);
                reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.TimeoutError());
            };
            xhr.send(request.content);
        });
    }
}
//# sourceMappingURL=XhrHttpClient.js.map

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpTransportType: () => (/* binding */ HttpTransportType),
/* harmony export */   TransferFormat: () => (/* binding */ TransferFormat)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// This will be treated as a bit flag in the future, so we keep it using power-of-two values.
/** Specifies a specific HTTP transport type. */
var HttpTransportType;
(function (HttpTransportType) {
    /** Specifies no transport preference. */
    HttpTransportType[HttpTransportType["None"] = 0] = "None";
    /** Specifies the WebSockets transport. */
    HttpTransportType[HttpTransportType["WebSockets"] = 1] = "WebSockets";
    /** Specifies the Server-Sent Events transport. */
    HttpTransportType[HttpTransportType["ServerSentEvents"] = 2] = "ServerSentEvents";
    /** Specifies the Long Polling transport. */
    HttpTransportType[HttpTransportType["LongPolling"] = 4] = "LongPolling";
})(HttpTransportType || (HttpTransportType = {}));
/** Specifies the transfer format for a connection. */
var TransferFormat;
(function (TransferFormat) {
    /** Specifies that only text data will be transmitted over the connection. */
    TransferFormat[TransferFormat["Text"] = 1] = "Text";
    /** Specifies that binary data will be transmitted over the connection. */
    TransferFormat[TransferFormat["Binary"] = 2] = "Binary";
})(TransferFormat || (TransferFormat = {}));
//# sourceMappingURL=ITransport.js.map

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LongPollingTransport: () => (/* binding */ LongPollingTransport)
/* harmony export */ });
/* harmony import */ var _AbortController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(20);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(22);
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





// Not exported from 'index', this type is internal.
/** @private */
class LongPollingTransport {
    // This is an internal type, not exported from 'index' so this is really just internal.
    get pollAborted() {
        return this._pollAbort.aborted;
    }
    constructor(httpClient, logger, options) {
        this._httpClient = httpClient;
        this._logger = logger;
        this._pollAbort = new _AbortController__WEBPACK_IMPORTED_MODULE_0__.AbortController();
        this._options = options;
        this._running = false;
        this.onreceive = null;
        this.onclose = null;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat, "transferFormat");
        this._url = url;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Connecting.");
        // Allow binary format on Node and Browsers that support binary content (indicated by the presence of responseType property)
        if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Binary &&
            (typeof XMLHttpRequest !== "undefined" && typeof new XMLHttpRequest().responseType !== "string")) {
            throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
        }
        const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
        const headers = { [name]: value, ...this._options.headers };
        const pollOptions = {
            abortSignal: this._pollAbort.signal,
            headers,
            timeout: 100000,
            withCredentials: this._options.withCredentials,
        };
        if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Binary) {
            pollOptions.responseType = "arraybuffer";
        }
        // Make initial long polling request
        // Server uses first long polling request to finish initializing connection and it returns without data
        const pollUrl = `${url}&_=${Date.now()}`;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
        const response = await this._httpClient.get(pollUrl, pollOptions);
        if (response.statusCode !== 200) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
            // Mark running as false so that the poll immediately ends and runs the close logic
            this._closeError = new _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError(response.statusText || "", response.statusCode);
            this._running = false;
        }
        else {
            this._running = true;
        }
        this._receiving = this._poll(this._url, pollOptions);
    }
    async _poll(url, pollOptions) {
        try {
            while (this._running) {
                try {
                    const pollUrl = `${url}&_=${Date.now()}`;
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
                    const response = await this._httpClient.get(pollUrl, pollOptions);
                    if (response.statusCode === 204) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Information, "(LongPolling transport) Poll terminated by server.");
                        this._running = false;
                    }
                    else if (response.statusCode !== 200) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
                        // Unexpected status code
                        this._closeError = new _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError(response.statusText || "", response.statusCode);
                        this._running = false;
                    }
                    else {
                        // Process the response
                        if (response.content) {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getDataDetail)(response.content, this._options.logMessageContent)}.`);
                            if (this.onreceive) {
                                this.onreceive(response.content);
                            }
                        }
                        else {
                            // This is another way timeout manifest.
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                        }
                    }
                }
                catch (e) {
                    if (!this._running) {
                        // Log but disregard errors that occur after stopping
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
                    }
                    else {
                        if (e instanceof _Errors__WEBPACK_IMPORTED_MODULE_4__.TimeoutError) {
                            // Ignore timeouts and reissue the poll.
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                        }
                        else {
                            // Close the connection with the error as the result.
                            this._closeError = e;
                            this._running = false;
                        }
                    }
                }
            }
        }
        finally {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Polling complete.");
            // We will reach here with pollAborted==false when the server returned a response causing the transport to stop.
            // If pollAborted==true then client initiated the stop and the stop method will raise the close event after DELETE is sent.
            if (!this.pollAborted) {
                this._raiseOnClose();
            }
        }
    }
    async send(data) {
        if (!this._running) {
            return Promise.reject(new Error("Cannot send until the transport is connected"));
        }
        return (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.sendMessage)(this._logger, "LongPolling", this._httpClient, this._url, data, this._options);
    }
    async stop() {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Stopping polling.");
        // Tell receiving loop to stop, abort any current request, and then wait for it to finish
        this._running = false;
        this._pollAbort.abort();
        try {
            await this._receiving;
            // Send DELETE to clean up long polling on the server
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
            const headers = {};
            const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
            headers[name] = value;
            const deleteOptions = {
                headers: { ...headers, ...this._options.headers },
                timeout: this._options.timeout,
                withCredentials: this._options.withCredentials,
            };
            let error;
            try {
                await this._httpClient.delete(this._url, deleteOptions);
            }
            catch (err) {
                error = err;
            }
            if (error) {
                if (error instanceof _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError) {
                    if (error.statusCode === 404) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.");
                    }
                    else {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) Error sending a DELETE request: ${error}`);
                    }
                }
            }
            else {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) DELETE request accepted.");
            }
        }
        finally {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Stop finished.");
            // Raise close event here instead of in polling
            // It needs to happen after the DELETE request is sent
            this._raiseOnClose();
        }
    }
    _raiseOnClose() {
        if (this.onclose) {
            let logMessage = "(LongPolling transport) Firing onclose event.";
            if (this._closeError) {
                logMessage += " Error: " + this._closeError;
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, logMessage);
            this.onclose(this._closeError);
        }
    }
}
//# sourceMappingURL=LongPollingTransport.js.map

/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortController: () => (/* binding */ AbortController)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Rough polyfill of https://developer.mozilla.org/en-US/docs/Web/API/AbortController
// We don't actually ever use the API being polyfilled, we always use the polyfill because
// it's a very new API right now.
// Not exported from index.
/** @private */
class AbortController {
    constructor() {
        this._isAborted = false;
        this.onabort = null;
    }
    abort() {
        if (!this._isAborted) {
            this._isAborted = true;
            if (this.onabort) {
                this.onabort();
            }
        }
    }
    get signal() {
        return this;
    }
    get aborted() {
        return this._isAborted;
    }
}
//# sourceMappingURL=AbortController.js.map

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServerSentEventsTransport: () => (/* binding */ ServerSentEventsTransport)
/* harmony export */ });
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22);
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(26);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.



/** @private */
class ServerSentEventsTransport {
    constructor(httpClient, accessToken, logger, options) {
        this._httpClient = httpClient;
        this._accessToken = accessToken;
        this._logger = logger;
        this._options = options;
        this.onreceive = null;
        this.onclose = null;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(SSE transport) Connecting.");
        // set url before accessTokenFactory because this._url is only for send and we set the auth header instead of the query string for send
        this._url = url;
        if (this._accessToken) {
            url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`;
        }
        return new Promise((resolve, reject) => {
            let opened = false;
            if (transferFormat !== _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat.Text) {
                reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
                return;
            }
            let eventSource;
            if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isBrowser || _Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isWebWorker) {
                eventSource = new this._options.EventSource(url, { withCredentials: this._options.withCredentials });
            }
            else {
                // Non-browser passes cookies via the dictionary
                const cookies = this._httpClient.getCookieString(url);
                const headers = {};
                headers.Cookie = cookies;
                const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
                headers[name] = value;
                eventSource = new this._options.EventSource(url, { withCredentials: this._options.withCredentials, headers: { ...headers, ...this._options.headers } });
            }
            try {
                eventSource.onmessage = (e) => {
                    if (this.onreceive) {
                        try {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(SSE transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(e.data, this._options.logMessageContent)}.`);
                            this.onreceive(e.data);
                        }
                        catch (error) {
                            this._close(error);
                            return;
                        }
                    }
                };
                // @ts-ignore: not using event on purpose
                eventSource.onerror = (e) => {
                    // EventSource doesn't give any useful information about server side closes.
                    if (opened) {
                        this._close();
                    }
                    else {
                        reject(new Error("EventSource failed to connect. The connection could not be found on the server,"
                            + " either the connection ID is not present on the server, or a proxy is refusing/buffering the connection."
                            + " If you have multiple servers check that sticky sessions are enabled."));
                    }
                };
                eventSource.onopen = () => {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `SSE connected to ${this._url}`);
                    this._eventSource = eventSource;
                    opened = true;
                    resolve();
                };
            }
            catch (e) {
                reject(e);
                return;
            }
        });
    }
    async send(data) {
        if (!this._eventSource) {
            return Promise.reject(new Error("Cannot send until the transport is connected"));
        }
        return (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.sendMessage)(this._logger, "SSE", this._httpClient, this._url, data, this._options);
    }
    stop() {
        this._close();
        return Promise.resolve();
    }
    _close(e) {
        if (this._eventSource) {
            this._eventSource.close();
            this._eventSource = undefined;
            if (this.onclose) {
                this.onclose(e);
            }
        }
    }
}
//# sourceMappingURL=ServerSentEventsTransport.js.map

/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebSocketTransport: () => (/* binding */ WebSocketTransport)
/* harmony export */ });
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(17);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22);
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(26);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




/** @private */
class WebSocketTransport {
    constructor(httpClient, accessTokenFactory, logger, logMessageContent, webSocketConstructor, headers) {
        this._logger = logger;
        this._accessTokenFactory = accessTokenFactory;
        this._logMessageContent = logMessageContent;
        this._webSocketConstructor = webSocketConstructor;
        this._httpClient = httpClient;
        this.onreceive = null;
        this.onclose = null;
        this._headers = headers;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(WebSockets transport) Connecting.");
        let token;
        if (this._accessTokenFactory) {
            token = await this._accessTokenFactory();
        }
        return new Promise((resolve, reject) => {
            url = url.replace(/^http/, "ws");
            let webSocket;
            const cookies = this._httpClient.getCookieString(url);
            let opened = false;
            if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode || _Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isReactNative) {
                const headers = {};
                const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
                headers[name] = value;
                if (token) {
                    headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_3__.HeaderNames.Authorization] = `Bearer ${token}`;
                }
                if (cookies) {
                    headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_3__.HeaderNames.Cookie] = cookies;
                }
                // Only pass headers when in non-browser environments
                webSocket = new this._webSocketConstructor(url, undefined, {
                    headers: { ...headers, ...this._headers },
                });
            }
            else {
                if (token) {
                    url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(token)}`;
                }
            }
            if (!webSocket) {
                // Chrome is not happy with passing 'undefined' as protocol
                webSocket = new this._webSocketConstructor(url);
            }
            if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat.Binary) {
                webSocket.binaryType = "arraybuffer";
            }
            webSocket.onopen = (_event) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `WebSocket connected to ${url}.`);
                this._webSocket = webSocket;
                opened = true;
                resolve();
            };
            webSocket.onerror = (event) => {
                let error = null;
                // ErrorEvent is a browser only type we need to check if the type exists before using it
                if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                    error = event.error;
                }
                else {
                    error = "There was an error with the transport";
                }
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `(WebSockets transport) ${error}.`);
            };
            webSocket.onmessage = (message) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(WebSockets transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(message.data, this._logMessageContent)}.`);
                if (this.onreceive) {
                    try {
                        this.onreceive(message.data);
                    }
                    catch (error) {
                        this._close(error);
                        return;
                    }
                }
            };
            webSocket.onclose = (event) => {
                // Don't call close handler if connection was never established
                // We'll reject the connect call instead
                if (opened) {
                    this._close(event);
                }
                else {
                    let error = null;
                    // ErrorEvent is a browser only type we need to check if the type exists before using it
                    if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                        error = event.error;
                    }
                    else {
                        error = "WebSocket failed to connect. The connection could not be found on the server,"
                            + " either the endpoint may not be a SignalR endpoint,"
                            + " the connection ID is not present on the server, or there is a proxy blocking WebSockets."
                            + " If you have multiple servers check that sticky sessions are enabled.";
                    }
                    reject(new Error(error));
                }
            };
        });
    }
    send(data) {
        if (this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(WebSockets transport) sending data. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(data, this._logMessageContent)}.`);
            this._webSocket.send(data);
            return Promise.resolve();
        }
        return Promise.reject("WebSocket is not in the OPEN state");
    }
    stop() {
        if (this._webSocket) {
            // Manually invoke onclose callback inline so we know the HttpConnection was closed properly before returning
            // This also solves an issue where websocket.onclose could take 18+ seconds to trigger during network disconnects
            this._close(undefined);
        }
        return Promise.resolve();
    }
    _close(event) {
        // webSocket will be null if the transport did not start successfully
        if (this._webSocket) {
            // Clear websocket handlers because we are considering the socket closed now
            this._webSocket.onclose = () => { };
            this._webSocket.onmessage = () => { };
            this._webSocket.onerror = () => { };
            this._webSocket.close();
            this._webSocket = undefined;
        }
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(WebSockets transport) socket closed.");
        if (this.onclose) {
            if (this._isCloseEvent(event) && (event.wasClean === false || event.code !== 1000)) {
                this.onclose(new Error(`WebSocket closed with status code: ${event.code} (${event.reason || "no reason given"}).`));
            }
            else if (event instanceof Error) {
                this.onclose(event);
            }
            else {
                this.onclose();
            }
        }
    }
    _isCloseEvent(event) {
        return event && typeof event.wasClean === "boolean" && typeof event.code === "number";
    }
}
//# sourceMappingURL=WebSocketTransport.js.map

/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HubConnection: () => (/* binding */ HubConnection),
/* harmony export */   HubConnectionState: () => (/* binding */ HubConnectionState)
/* harmony export */ });
/* harmony import */ var _HandshakeProtocol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32);
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(20);
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(34);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(35);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23);
/* harmony import */ var _MessageBuffer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(36);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.







const DEFAULT_TIMEOUT_IN_MS = 30 * 1000;
const DEFAULT_PING_INTERVAL_IN_MS = 15 * 1000;
const DEFAULT_STATEFUL_RECONNECT_BUFFER_SIZE = 100000;
/** Describes the current state of the {@link HubConnection} to the server. */
var HubConnectionState;
(function (HubConnectionState) {
    /** The hub connection is disconnected. */
    HubConnectionState["Disconnected"] = "Disconnected";
    /** The hub connection is connecting. */
    HubConnectionState["Connecting"] = "Connecting";
    /** The hub connection is connected. */
    HubConnectionState["Connected"] = "Connected";
    /** The hub connection is disconnecting. */
    HubConnectionState["Disconnecting"] = "Disconnecting";
    /** The hub connection is reconnecting. */
    HubConnectionState["Reconnecting"] = "Reconnecting";
})(HubConnectionState || (HubConnectionState = {}));
/** Represents a connection to a SignalR Hub. */
class HubConnection {
    /** @internal */
    // Using a public static factory method means we can have a private constructor and an _internal_
    // create method that can be used by HubConnectionBuilder. An "internal" constructor would just
    // be stripped away and the '.d.ts' file would have no constructor, which is interpreted as a
    // public parameter-less constructor.
    static create(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize) {
        return new HubConnection(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize);
    }
    constructor(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize) {
        this._nextKeepAlive = 0;
        this._freezeEventListener = () => {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
        };
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(connection, "connection");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(logger, "logger");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(protocol, "protocol");
        this.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds !== null && serverTimeoutInMilliseconds !== void 0 ? serverTimeoutInMilliseconds : DEFAULT_TIMEOUT_IN_MS;
        this.keepAliveIntervalInMilliseconds = keepAliveIntervalInMilliseconds !== null && keepAliveIntervalInMilliseconds !== void 0 ? keepAliveIntervalInMilliseconds : DEFAULT_PING_INTERVAL_IN_MS;
        this._statefulReconnectBufferSize = statefulReconnectBufferSize !== null && statefulReconnectBufferSize !== void 0 ? statefulReconnectBufferSize : DEFAULT_STATEFUL_RECONNECT_BUFFER_SIZE;
        this._logger = logger;
        this._protocol = protocol;
        this.connection = connection;
        this._reconnectPolicy = reconnectPolicy;
        this._handshakeProtocol = new _HandshakeProtocol__WEBPACK_IMPORTED_MODULE_2__.HandshakeProtocol();
        this.connection.onreceive = (data) => this._processIncomingData(data);
        this.connection.onclose = (error) => this._connectionClosed(error);
        this._callbacks = {};
        this._methods = {};
        this._closedCallbacks = [];
        this._reconnectingCallbacks = [];
        this._reconnectedCallbacks = [];
        this._invocationId = 0;
        this._receivedHandshakeResponse = false;
        this._connectionState = HubConnectionState.Disconnected;
        this._connectionStarted = false;
        this._cachedPingMessage = this._protocol.writeMessage({ type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping });
    }
    /** Indicates the state of the {@link HubConnection} to the server. */
    get state() {
        return this._connectionState;
    }
    /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
     *  in the disconnected state or if the negotiation step was skipped.
     */
    get connectionId() {
        return this.connection ? (this.connection.connectionId || null) : null;
    }
    /** Indicates the url of the {@link HubConnection} to the server. */
    get baseUrl() {
        return this.connection.baseUrl || "";
    }
    /**
     * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
     * Reconnecting states.
     * @param {string} url The url to connect to.
     */
    set baseUrl(url) {
        if (this._connectionState !== HubConnectionState.Disconnected && this._connectionState !== HubConnectionState.Reconnecting) {
            throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
        }
        if (!url) {
            throw new Error("The HubConnection url must be a valid url.");
        }
        this.connection.baseUrl = url;
    }
    /** Starts the connection.
     *
     * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
     */
    start() {
        this._startPromise = this._startWithStateTransitions();
        return this._startPromise;
    }
    async _startWithStateTransitions() {
        if (this._connectionState !== HubConnectionState.Disconnected) {
            return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
        }
        this._connectionState = HubConnectionState.Connecting;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Starting HubConnection.");
        try {
            await this._startInternal();
            if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isBrowser) {
                // Log when the browser freezes the tab so users know why their connection unexpectedly stopped working
                window.document.addEventListener("freeze", this._freezeEventListener);
            }
            this._connectionState = HubConnectionState.Connected;
            this._connectionStarted = true;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "HubConnection connected successfully.");
        }
        catch (e) {
            this._connectionState = HubConnectionState.Disconnected;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `HubConnection failed to start successfully because of error '${e}'.`);
            return Promise.reject(e);
        }
    }
    async _startInternal() {
        this._stopDuringStartError = undefined;
        this._receivedHandshakeResponse = false;
        // Set up the promise before any connection is (re)started otherwise it could race with received messages
        const handshakePromise = new Promise((resolve, reject) => {
            this._handshakeResolver = resolve;
            this._handshakeRejecter = reject;
        });
        await this.connection.start(this._protocol.transferFormat);
        try {
            let version = this._protocol.version;
            if (!this.connection.features.reconnect) {
                // Stateful Reconnect starts with HubProtocol version 2, newer clients connecting to older servers will fail to connect due to
                // the handshake only supporting version 1, so we will try to send version 1 during the handshake to keep old servers working.
                version = 1;
            }
            const handshakeRequest = {
                protocol: this._protocol.name,
                version,
            };
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Sending handshake request.");
            await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(handshakeRequest));
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Using HubProtocol '${this._protocol.name}'.`);
            // defensively cleanup timeout in case we receive a message from the server before we finish start
            this._cleanupTimeout();
            this._resetTimeoutPeriod();
            this._resetKeepAliveInterval();
            await handshakePromise;
            // It's important to check the stopDuringStartError instead of just relying on the handshakePromise
            // being rejected on close, because this continuation can run after both the handshake completed successfully
            // and the connection was closed.
            if (this._stopDuringStartError) {
                // It's important to throw instead of returning a rejected promise, because we don't want to allow any state
                // transitions to occur between now and the calling code observing the exceptions. Returning a rejected promise
                // will cause the calling continuation to get scheduled to run later.
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw this._stopDuringStartError;
            }
            const useStatefulReconnect = this.connection.features.reconnect || false;
            if (useStatefulReconnect) {
                this._messageBuffer = new _MessageBuffer__WEBPACK_IMPORTED_MODULE_4__.MessageBuffer(this._protocol, this.connection, this._statefulReconnectBufferSize);
                this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer);
                this.connection.features.resend = () => {
                    if (this._messageBuffer) {
                        return this._messageBuffer._resend();
                    }
                };
            }
            if (!this.connection.features.inherentKeepAlive) {
                await this._sendMessage(this._cachedPingMessage);
            }
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`);
            this._cleanupTimeout();
            this._cleanupPingTimer();
            // HttpConnection.stop() should not complete until after the onclose callback is invoked.
            // This will transition the HubConnection to the disconnected state before HttpConnection.stop() completes.
            await this.connection.stop(e);
            throw e;
        }
    }
    /** Stops the connection.
     *
     * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
     */
    async stop() {
        // Capture the start promise before the connection might be restarted in an onclose callback.
        const startPromise = this._startPromise;
        this.connection.features.reconnect = false;
        this._stopPromise = this._stopInternal();
        await this._stopPromise;
        try {
            // Awaiting undefined continues immediately
            await startPromise;
        }
        catch (e) {
            // This exception is returned to the user as a rejected Promise from the start method.
        }
    }
    _stopInternal(error) {
        if (this._connectionState === HubConnectionState.Disconnected) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Call to HubConnection.stop(${error}) ignored because it is already in the disconnected state.`);
            return Promise.resolve();
        }
        if (this._connectionState === HubConnectionState.Disconnecting) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
            return this._stopPromise;
        }
        const state = this._connectionState;
        this._connectionState = HubConnectionState.Disconnecting;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Stopping HubConnection.");
        if (this._reconnectDelayHandle) {
            // We're in a reconnect delay which means the underlying connection is currently already stopped.
            // Just clear the handle to stop the reconnect loop (which no one is waiting on thankfully) and
            // fire the onclose callbacks.
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection stopped during reconnect delay. Done reconnecting.");
            clearTimeout(this._reconnectDelayHandle);
            this._reconnectDelayHandle = undefined;
            this._completeClose();
            return Promise.resolve();
        }
        if (state === HubConnectionState.Connected) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._sendCloseMessage();
        }
        this._cleanupTimeout();
        this._cleanupPingTimer();
        this._stopDuringStartError = error || new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError("The connection was stopped before the hub handshake could complete.");
        // HttpConnection.stop() should not complete until after either HttpConnection.start() fails
        // or the onclose callback is invoked. The onclose callback will transition the HubConnection
        // to the disconnected state if need be before HttpConnection.stop() completes.
        return this.connection.stop(error);
    }
    async _sendCloseMessage() {
        try {
            await this._sendWithProtocol(this._createCloseMessage());
        }
        catch {
            // Ignore, this is a best effort attempt to let the server know the client closed gracefully.
        }
    }
    /** Invokes a streaming hub method on the server using the specified name and arguments.
     *
     * @typeparam T The type of the items returned by the server.
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
     */
    stream(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const invocationDescriptor = this._createStreamInvocation(methodName, args, streamIds);
        // eslint-disable-next-line prefer-const
        let promiseQueue;
        const subject = new _Subject__WEBPACK_IMPORTED_MODULE_6__.Subject();
        subject.cancelCallback = () => {
            const cancelInvocation = this._createCancelInvocation(invocationDescriptor.invocationId);
            delete this._callbacks[invocationDescriptor.invocationId];
            return promiseQueue.then(() => {
                return this._sendWithProtocol(cancelInvocation);
            });
        };
        this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
            if (error) {
                subject.error(error);
                return;
            }
            else if (invocationEvent) {
                // invocationEvent will not be null when an error is not passed to the callback
                if (invocationEvent.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                    if (invocationEvent.error) {
                        subject.error(new Error(invocationEvent.error));
                    }
                    else {
                        subject.complete();
                    }
                }
                else {
                    subject.next((invocationEvent.item));
                }
            }
        };
        promiseQueue = this._sendWithProtocol(invocationDescriptor)
            .catch((e) => {
            subject.error(e);
            delete this._callbacks[invocationDescriptor.invocationId];
        });
        this._launchStreams(streams, promiseQueue);
        return subject;
    }
    _sendMessage(message) {
        this._resetKeepAliveInterval();
        return this.connection.send(message);
    }
    /**
     * Sends a js object to the server.
     * @param message The js object to serialize and send.
     */
    _sendWithProtocol(message) {
        if (this._messageBuffer) {
            return this._messageBuffer._send(message);
        }
        else {
            return this._sendMessage(this._protocol.writeMessage(message));
        }
    }
    /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
     *
     * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
     * be processing the invocation.
     *
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
     */
    send(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const sendPromise = this._sendWithProtocol(this._createInvocation(methodName, args, true, streamIds));
        this._launchStreams(streams, sendPromise);
        return sendPromise;
    }
    /** Invokes a hub method on the server using the specified name and arguments.
     *
     * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
     * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
     * resolving the Promise.
     *
     * @typeparam T The expected return type.
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
     */
    invoke(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const invocationDescriptor = this._createInvocation(methodName, args, false, streamIds);
        const p = new Promise((resolve, reject) => {
            // invocationId will always have a value for a non-blocking invocation
            this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
                if (error) {
                    reject(error);
                    return;
                }
                else if (invocationEvent) {
                    // invocationEvent will not be null when an error is not passed to the callback
                    if (invocationEvent.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                        if (invocationEvent.error) {
                            reject(new Error(invocationEvent.error));
                        }
                        else {
                            resolve(invocationEvent.result);
                        }
                    }
                    else {
                        reject(new Error(`Unexpected message type: ${invocationEvent.type}`));
                    }
                }
            };
            const promiseQueue = this._sendWithProtocol(invocationDescriptor)
                .catch((e) => {
                reject(e);
                // invocationId will always have a value for a non-blocking invocation
                delete this._callbacks[invocationDescriptor.invocationId];
            });
            this._launchStreams(streams, promiseQueue);
        });
        return p;
    }
    on(methodName, newMethod) {
        if (!methodName || !newMethod) {
            return;
        }
        methodName = methodName.toLowerCase();
        if (!this._methods[methodName]) {
            this._methods[methodName] = [];
        }
        // Preventing adding the same handler multiple times.
        if (this._methods[methodName].indexOf(newMethod) !== -1) {
            return;
        }
        this._methods[methodName].push(newMethod);
    }
    off(methodName, method) {
        if (!methodName) {
            return;
        }
        methodName = methodName.toLowerCase();
        const handlers = this._methods[methodName];
        if (!handlers) {
            return;
        }
        if (method) {
            const removeIdx = handlers.indexOf(method);
            if (removeIdx !== -1) {
                handlers.splice(removeIdx, 1);
                if (handlers.length === 0) {
                    delete this._methods[methodName];
                }
            }
        }
        else {
            delete this._methods[methodName];
        }
    }
    /** Registers a handler that will be invoked when the connection is closed.
     *
     * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
     */
    onclose(callback) {
        if (callback) {
            this._closedCallbacks.push(callback);
        }
    }
    /** Registers a handler that will be invoked when the connection starts reconnecting.
     *
     * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
     */
    onreconnecting(callback) {
        if (callback) {
            this._reconnectingCallbacks.push(callback);
        }
    }
    /** Registers a handler that will be invoked when the connection successfully reconnects.
     *
     * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
     */
    onreconnected(callback) {
        if (callback) {
            this._reconnectedCallbacks.push(callback);
        }
    }
    _processIncomingData(data) {
        this._cleanupTimeout();
        if (!this._receivedHandshakeResponse) {
            data = this._processHandshakeResponse(data);
            this._receivedHandshakeResponse = true;
        }
        // Data may have all been read when processing handshake response
        if (data) {
            // Parse the messages
            const messages = this._protocol.parseMessages(data, this._logger);
            for (const message of messages) {
                if (this._messageBuffer && !this._messageBuffer._shouldProcessMessage(message)) {
                    // Don't process the message, we are either waiting for a SequenceMessage or received a duplicate message
                    continue;
                }
                switch (message.type) {
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation:
                        this._invokeClientMethod(message)
                            .catch((e) => {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Invoke client method threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
                        });
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem:
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion: {
                        const callback = this._callbacks[message.invocationId];
                        if (callback) {
                            if (message.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                                delete this._callbacks[message.invocationId];
                            }
                            try {
                                callback(message);
                            }
                            catch (e) {
                                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Stream callback threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
                            }
                        }
                        break;
                    }
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping:
                        // Don't care about pings
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close: {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "Close message received from server.");
                        const error = message.error ? new Error("Server returned an error on close: " + message.error) : undefined;
                        if (message.allowReconnect === true) {
                            // It feels wrong not to await connection.stop() here, but processIncomingData is called as part of an onreceive callback which is not async,
                            // this is already the behavior for serverTimeout(), and HttpConnection.Stop() should catch and log all possible exceptions.
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.connection.stop(error);
                        }
                        else {
                            // We cannot await stopInternal() here, but subsequent calls to stop() will await this if stopInternal() is still ongoing.
                            this._stopPromise = this._stopInternal(error);
                        }
                        break;
                    }
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ack:
                        if (this._messageBuffer) {
                            this._messageBuffer._ack(message);
                        }
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Sequence:
                        if (this._messageBuffer) {
                            this._messageBuffer._resetSequence(message);
                        }
                        break;
                    default:
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `Invalid message type: ${message.type}.`);
                        break;
                }
            }
        }
        this._resetTimeoutPeriod();
    }
    _processHandshakeResponse(data) {
        let responseMessage;
        let remainingData;
        try {
            [remainingData, responseMessage] = this._handshakeProtocol.parseHandshakeResponse(data);
        }
        catch (e) {
            const message = "Error parsing handshake response: " + e;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, message);
            const error = new Error(message);
            this._handshakeRejecter(error);
            throw error;
        }
        if (responseMessage.error) {
            const message = "Server returned handshake error: " + responseMessage.error;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, message);
            const error = new Error(message);
            this._handshakeRejecter(error);
            throw error;
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Server handshake complete.");
        }
        this._handshakeResolver();
        return remainingData;
    }
    _resetKeepAliveInterval() {
        if (this.connection.features.inherentKeepAlive) {
            return;
        }
        // Set the time we want the next keep alive to be sent
        // Timer will be setup on next message receive
        this._nextKeepAlive = new Date().getTime() + this.keepAliveIntervalInMilliseconds;
        this._cleanupPingTimer();
    }
    _resetTimeoutPeriod() {
        if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
            // Set the timeout timer
            this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
            // Set keepAlive timer if there isn't one
            if (this._pingServerHandle === undefined) {
                let nextPing = this._nextKeepAlive - new Date().getTime();
                if (nextPing < 0) {
                    nextPing = 0;
                }
                // The timer needs to be set from a networking callback to avoid Chrome timer throttling from causing timers to run once a minute
                this._pingServerHandle = setTimeout(async () => {
                    if (this._connectionState === HubConnectionState.Connected) {
                        try {
                            await this._sendMessage(this._cachedPingMessage);
                        }
                        catch {
                            // We don't care about the error. It should be seen elsewhere in the client.
                            // The connection is probably in a bad or closed state now, cleanup the timer so it stops triggering
                            this._cleanupPingTimer();
                        }
                    }
                }, nextPing);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    serverTimeout() {
        // The server hasn't talked to us in a while. It doesn't like us anymore ... :(
        // Terminate the connection, but we don't need to wait on the promise. This could trigger reconnecting.
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
    }
    async _invokeClientMethod(invocationMessage) {
        const methodName = invocationMessage.target.toLowerCase();
        const methods = this._methods[methodName];
        if (!methods) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `No client method with the name '${methodName}' found.`);
            // No handlers provided by client but the server is expecting a response still, so we send an error
            if (invocationMessage.invocationId) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `No result given for '${methodName}' method and invocation ID '${invocationMessage.invocationId}'.`);
                await this._sendWithProtocol(this._createCompletionMessage(invocationMessage.invocationId, "Client didn't provide a result.", null));
            }
            return;
        }
        // Avoid issues with handlers removing themselves thus modifying the list while iterating through it
        const methodsCopy = methods.slice();
        // Server expects a response
        const expectsResponse = invocationMessage.invocationId ? true : false;
        // We preserve the last result or exception but still call all handlers
        let res;
        let exception;
        let completionMessage;
        for (const m of methodsCopy) {
            try {
                const prevRes = res;
                res = await m.apply(this, invocationMessage.arguments);
                if (expectsResponse && res && prevRes) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Multiple results provided for '${methodName}'. Sending error to server.`);
                    completionMessage = this._createCompletionMessage(invocationMessage.invocationId, `Client provided multiple results.`, null);
                }
                // Ignore exception if we got a result after, the exception will be logged
                exception = undefined;
            }
            catch (e) {
                exception = e;
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `A callback for the method '${methodName}' threw error '${e}'.`);
            }
        }
        if (completionMessage) {
            await this._sendWithProtocol(completionMessage);
        }
        else if (expectsResponse) {
            // If there is an exception that means either no result was given or a handler after a result threw
            if (exception) {
                completionMessage = this._createCompletionMessage(invocationMessage.invocationId, `${exception}`, null);
            }
            else if (res !== undefined) {
                completionMessage = this._createCompletionMessage(invocationMessage.invocationId, null, res);
            }
            else {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `No result given for '${methodName}' method and invocation ID '${invocationMessage.invocationId}'.`);
                // Client didn't provide a result or throw from a handler, server expects a response so we send an error
                completionMessage = this._createCompletionMessage(invocationMessage.invocationId, "Client didn't provide a result.", null);
            }
            await this._sendWithProtocol(completionMessage);
        }
        else {
            if (res) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Result given for '${methodName}' method but server is not expecting a result.`);
            }
        }
    }
    _connectionClosed(error) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `HubConnection.connectionClosed(${error}) called while in state ${this._connectionState}.`);
        // Triggering this.handshakeRejecter is insufficient because it could already be resolved without the continuation having run yet.
        this._stopDuringStartError = this._stopDuringStartError || error || new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError("The underlying connection was closed before the hub handshake could complete.");
        // If the handshake is in progress, start will be waiting for the handshake promise, so we complete it.
        // If it has already completed, this should just noop.
        if (this._handshakeResolver) {
            this._handshakeResolver();
        }
        this._cancelCallbacksWithError(error || new Error("Invocation canceled due to the underlying connection being closed."));
        this._cleanupTimeout();
        this._cleanupPingTimer();
        if (this._connectionState === HubConnectionState.Disconnecting) {
            this._completeClose(error);
        }
        else if (this._connectionState === HubConnectionState.Connected && this._reconnectPolicy) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._reconnect(error);
        }
        else if (this._connectionState === HubConnectionState.Connected) {
            this._completeClose(error);
        }
        // If none of the above if conditions were true were called the HubConnection must be in either:
        // 1. The Connecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail it.
        // 2. The Reconnecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail the current reconnect attempt
        //    and potentially continue the reconnect() loop.
        // 3. The Disconnected state in which case we're already done.
    }
    _completeClose(error) {
        if (this._connectionStarted) {
            this._connectionState = HubConnectionState.Disconnected;
            this._connectionStarted = false;
            if (this._messageBuffer) {
                this._messageBuffer._dispose(error !== null && error !== void 0 ? error : new Error("Connection closed."));
                this._messageBuffer = undefined;
            }
            if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isBrowser) {
                window.document.removeEventListener("freeze", this._freezeEventListener);
            }
            try {
                this._closedCallbacks.forEach((c) => c.apply(this, [error]));
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onclose callback called with error '${error}' threw error '${e}'.`);
            }
        }
    }
    async _reconnect(error) {
        const reconnectStartTime = Date.now();
        let previousReconnectAttempts = 0;
        let retryError = error !== undefined ? error : new Error("Attempting to reconnect due to a unknown error.");
        let nextRetryDelay = this._getNextRetryDelay(previousReconnectAttempts++, 0, retryError);
        if (nextRetryDelay === null) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt.");
            this._completeClose(error);
            return;
        }
        this._connectionState = HubConnectionState.Reconnecting;
        if (error) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Connection reconnecting because of error '${error}'.`);
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "Connection reconnecting.");
        }
        if (this._reconnectingCallbacks.length !== 0) {
            try {
                this._reconnectingCallbacks.forEach((c) => c.apply(this, [error]));
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onreconnecting callback called with error '${error}' threw error '${e}'.`);
            }
            // Exit early if an onreconnecting callback called connection.stop().
            if (this._connectionState !== HubConnectionState.Reconnecting) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
                return;
            }
        }
        while (nextRetryDelay !== null) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect attempt number ${previousReconnectAttempts} will start in ${nextRetryDelay} ms.`);
            await new Promise((resolve) => {
                this._reconnectDelayHandle = setTimeout(resolve, nextRetryDelay);
            });
            this._reconnectDelayHandle = undefined;
            if (this._connectionState !== HubConnectionState.Reconnecting) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
                return;
            }
            try {
                await this._startInternal();
                this._connectionState = HubConnectionState.Connected;
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "HubConnection reconnected successfully.");
                if (this._reconnectedCallbacks.length !== 0) {
                    try {
                        this._reconnectedCallbacks.forEach((c) => c.apply(this, [this.connection.connectionId]));
                    }
                    catch (e) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
                    }
                }
                return;
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect attempt failed because of error '${e}'.`);
                if (this._connectionState !== HubConnectionState.Reconnecting) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`);
                    // The TypeScript compiler thinks that connectionState must be Connected here. The TypeScript compiler is wrong.
                    if (this._connectionState === HubConnectionState.Disconnecting) {
                        this._completeClose();
                    }
                    return;
                }
                retryError = e instanceof Error ? e : new Error(e.toString());
                nextRetryDelay = this._getNextRetryDelay(previousReconnectAttempts++, Date.now() - reconnectStartTime, retryError);
            }
        }
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect retries have been exhausted after ${Date.now() - reconnectStartTime} ms and ${previousReconnectAttempts} failed attempts. Connection disconnecting.`);
        this._completeClose();
    }
    _getNextRetryDelay(previousRetryCount, elapsedMilliseconds, retryReason) {
        try {
            return this._reconnectPolicy.nextRetryDelayInMilliseconds({
                elapsedMilliseconds,
                previousRetryCount,
                retryReason,
            });
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${previousRetryCount}, ${elapsedMilliseconds}) threw error '${e}'.`);
            return null;
        }
    }
    _cancelCallbacksWithError(error) {
        const callbacks = this._callbacks;
        this._callbacks = {};
        Object.keys(callbacks)
            .forEach((key) => {
            const callback = callbacks[key];
            try {
                callback(null, error);
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Stream 'error' callback called with '${error}' threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
            }
        });
    }
    _cleanupPingTimer() {
        if (this._pingServerHandle) {
            clearTimeout(this._pingServerHandle);
            this._pingServerHandle = undefined;
        }
    }
    _cleanupTimeout() {
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
        }
    }
    _createInvocation(methodName, args, nonblocking, streamIds) {
        if (nonblocking) {
            if (streamIds.length !== 0) {
                return {
                    arguments: args,
                    streamIds,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
            else {
                return {
                    arguments: args,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
        }
        else {
            const invocationId = this._invocationId;
            this._invocationId++;
            if (streamIds.length !== 0) {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    streamIds,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
            else {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
        }
    }
    _launchStreams(streams, promiseQueue) {
        if (streams.length === 0) {
            return;
        }
        // Synchronize stream data so they arrive in-order on the server
        if (!promiseQueue) {
            promiseQueue = Promise.resolve();
        }
        // We want to iterate over the keys, since the keys are the stream ids
        // eslint-disable-next-line guard-for-in
        for (const streamId in streams) {
            streams[streamId].subscribe({
                complete: () => {
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId)));
                },
                error: (err) => {
                    let message;
                    if (err instanceof Error) {
                        message = err.message;
                    }
                    else if (err && err.toString) {
                        message = err.toString();
                    }
                    else {
                        message = "Unknown error";
                    }
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId, message)));
                },
                next: (item) => {
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createStreamItemMessage(streamId, item)));
                },
            });
        }
    }
    _replaceStreamingParams(args) {
        const streams = [];
        const streamIds = [];
        for (let i = 0; i < args.length; i++) {
            const argument = args[i];
            if (this._isObservable(argument)) {
                const streamId = this._invocationId;
                this._invocationId++;
                // Store the stream for later use
                streams[streamId] = argument;
                streamIds.push(streamId.toString());
                // remove stream from args
                args.splice(i, 1);
            }
        }
        return [streams, streamIds];
    }
    _isObservable(arg) {
        // This allows other stream implementations to just work (like rxjs)
        return arg && arg.subscribe && typeof arg.subscribe === "function";
    }
    _createStreamInvocation(methodName, args, streamIds) {
        const invocationId = this._invocationId;
        this._invocationId++;
        if (streamIds.length !== 0) {
            return {
                arguments: args,
                invocationId: invocationId.toString(),
                streamIds,
                target: methodName,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamInvocation,
            };
        }
        else {
            return {
                arguments: args,
                invocationId: invocationId.toString(),
                target: methodName,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamInvocation,
            };
        }
    }
    _createCancelInvocation(id) {
        return {
            invocationId: id,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.CancelInvocation,
        };
    }
    _createStreamItemMessage(id, item) {
        return {
            invocationId: id,
            item,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem,
        };
    }
    _createCompletionMessage(id, error, result) {
        if (error) {
            return {
                error,
                invocationId: id,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion,
            };
        }
        return {
            invocationId: id,
            result,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion,
        };
    }
    _createCloseMessage() {
        return { type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close };
    }
}
//# sourceMappingURL=HubConnection.js.map

/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HandshakeProtocol: () => (/* binding */ HandshakeProtocol)
/* harmony export */ });
/* harmony import */ var _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class HandshakeProtocol {
    // Handshake request is always JSON
    writeHandshakeRequest(handshakeRequest) {
        return _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.write(JSON.stringify(handshakeRequest));
    }
    parseHandshakeResponse(data) {
        let messageData;
        let remainingData;
        if ((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer)(data)) {
            // Format is binary but still need to read JSON text from handshake response
            const binaryData = new Uint8Array(data);
            const separatorIndex = binaryData.indexOf(_TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.RecordSeparatorCode);
            if (separatorIndex === -1) {
                throw new Error("Message is incomplete.");
            }
            // content before separator is handshake response
            // optional content after is additional messages
            const responseLength = separatorIndex + 1;
            messageData = String.fromCharCode.apply(null, Array.prototype.slice.call(binaryData.slice(0, responseLength)));
            remainingData = (binaryData.byteLength > responseLength) ? binaryData.slice(responseLength).buffer : null;
        }
        else {
            const textData = data;
            const separatorIndex = textData.indexOf(_TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.RecordSeparator);
            if (separatorIndex === -1) {
                throw new Error("Message is incomplete.");
            }
            // content before separator is handshake response
            // optional content after is additional messages
            const responseLength = separatorIndex + 1;
            messageData = textData.substring(0, responseLength);
            remainingData = (textData.length > responseLength) ? textData.substring(responseLength) : null;
        }
        // At this point we should have just the single handshake message
        const messages = _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.parse(messageData);
        const response = JSON.parse(messages[0]);
        if (response.type) {
            throw new Error("Expected a handshake response from the server.");
        }
        const responseMessage = response;
        // multiple messages could have arrived with handshake
        // return additional data to be parsed as usual, or null if all parsed
        return [remainingData, responseMessage];
    }
}
//# sourceMappingURL=HandshakeProtocol.js.map

/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextMessageFormat: () => (/* binding */ TextMessageFormat)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Not exported from index
/** @private */
class TextMessageFormat {
    static write(output) {
        return `${output}${TextMessageFormat.RecordSeparator}`;
    }
    static parse(input) {
        if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
            throw new Error("Message is incomplete.");
        }
        const messages = input.split(TextMessageFormat.RecordSeparator);
        messages.pop();
        return messages;
    }
}
TextMessageFormat.RecordSeparatorCode = 0x1e;
TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);
//# sourceMappingURL=TextMessageFormat.js.map

/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageType: () => (/* binding */ MessageType)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Defines the type of a Hub Message. */
var MessageType;
(function (MessageType) {
    /** Indicates the message is an Invocation message and implements the {@link @microsoft/signalr.InvocationMessage} interface. */
    MessageType[MessageType["Invocation"] = 1] = "Invocation";
    /** Indicates the message is a StreamItem message and implements the {@link @microsoft/signalr.StreamItemMessage} interface. */
    MessageType[MessageType["StreamItem"] = 2] = "StreamItem";
    /** Indicates the message is a Completion message and implements the {@link @microsoft/signalr.CompletionMessage} interface. */
    MessageType[MessageType["Completion"] = 3] = "Completion";
    /** Indicates the message is a Stream Invocation message and implements the {@link @microsoft/signalr.StreamInvocationMessage} interface. */
    MessageType[MessageType["StreamInvocation"] = 4] = "StreamInvocation";
    /** Indicates the message is a Cancel Invocation message and implements the {@link @microsoft/signalr.CancelInvocationMessage} interface. */
    MessageType[MessageType["CancelInvocation"] = 5] = "CancelInvocation";
    /** Indicates the message is a Ping message and implements the {@link @microsoft/signalr.PingMessage} interface. */
    MessageType[MessageType["Ping"] = 6] = "Ping";
    /** Indicates the message is a Close message and implements the {@link @microsoft/signalr.CloseMessage} interface. */
    MessageType[MessageType["Close"] = 7] = "Close";
    MessageType[MessageType["Ack"] = 8] = "Ack";
    MessageType[MessageType["Sequence"] = 9] = "Sequence";
})(MessageType || (MessageType = {}));
//# sourceMappingURL=IHubProtocol.js.map

/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Subject: () => (/* binding */ Subject)
/* harmony export */ });
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

/** Stream implementation to stream items to the server. */
class Subject {
    constructor() {
        this.observers = [];
    }
    next(item) {
        for (const observer of this.observers) {
            observer.next(item);
        }
    }
    error(err) {
        for (const observer of this.observers) {
            if (observer.error) {
                observer.error(err);
            }
        }
    }
    complete() {
        for (const observer of this.observers) {
            if (observer.complete) {
                observer.complete();
            }
        }
    }
    subscribe(observer) {
        this.observers.push(observer);
        return new _Utils__WEBPACK_IMPORTED_MODULE_0__.SubjectSubscription(this, observer);
    }
}
//# sourceMappingURL=Subject.js.map

/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageBuffer: () => (/* binding */ MessageBuffer)
/* harmony export */ });
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(34);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class MessageBuffer {
    constructor(protocol, connection, bufferSize) {
        this._bufferSize = 100000;
        this._messages = [];
        this._totalMessageCount = 0;
        this._waitForSequenceMessage = false;
        // Message IDs start at 1 and always increment by 1
        this._nextReceivingSequenceId = 1;
        this._latestReceivedSequenceId = 0;
        this._bufferedByteCount = 0;
        this._reconnectInProgress = false;
        this._protocol = protocol;
        this._connection = connection;
        this._bufferSize = bufferSize;
    }
    async _send(message) {
        const serializedMessage = this._protocol.writeMessage(message);
        let backpressurePromise = Promise.resolve();
        // Only count invocation messages. Acks, pings, etc. don't need to be resent on reconnect
        if (this._isInvocationMessage(message)) {
            this._totalMessageCount++;
            let backpressurePromiseResolver = () => { };
            let backpressurePromiseRejector = () => { };
            if ((0,_Utils__WEBPACK_IMPORTED_MODULE_0__.isArrayBuffer)(serializedMessage)) {
                this._bufferedByteCount += serializedMessage.byteLength;
            }
            else {
                this._bufferedByteCount += serializedMessage.length;
            }
            if (this._bufferedByteCount >= this._bufferSize) {
                backpressurePromise = new Promise((resolve, reject) => {
                    backpressurePromiseResolver = resolve;
                    backpressurePromiseRejector = reject;
                });
            }
            this._messages.push(new BufferedItem(serializedMessage, this._totalMessageCount, backpressurePromiseResolver, backpressurePromiseRejector));
        }
        try {
            // If this is set it means we are reconnecting or resending
            // We don't want to send on a disconnected connection
            // And we don't want to send if resend is running since that would mean sending
            // this message twice
            if (!this._reconnectInProgress) {
                await this._connection.send(serializedMessage);
            }
        }
        catch {
            this._disconnected();
        }
        await backpressurePromise;
    }
    _ack(ackMessage) {
        let newestAckedMessage = -1;
        // Find index of newest message being acked
        for (let index = 0; index < this._messages.length; index++) {
            const element = this._messages[index];
            if (element._id <= ackMessage.sequenceId) {
                newestAckedMessage = index;
                if ((0,_Utils__WEBPACK_IMPORTED_MODULE_0__.isArrayBuffer)(element._message)) {
                    this._bufferedByteCount -= element._message.byteLength;
                }
                else {
                    this._bufferedByteCount -= element._message.length;
                }
                // resolve items that have already been sent and acked
                element._resolver();
            }
            else if (this._bufferedByteCount < this._bufferSize) {
                // resolve items that now fall under the buffer limit but haven't been acked
                element._resolver();
            }
            else {
                break;
            }
        }
        if (newestAckedMessage !== -1) {
            // We're removing everything including the message pointed to, so add 1
            this._messages = this._messages.slice(newestAckedMessage + 1);
        }
    }
    _shouldProcessMessage(message) {
        if (this._waitForSequenceMessage) {
            if (message.type !== _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Sequence) {
                return false;
            }
            else {
                this._waitForSequenceMessage = false;
                return true;
            }
        }
        // No special processing for acks, pings, etc.
        if (!this._isInvocationMessage(message)) {
            return true;
        }
        const currentId = this._nextReceivingSequenceId;
        this._nextReceivingSequenceId++;
        if (currentId <= this._latestReceivedSequenceId) {
            if (currentId === this._latestReceivedSequenceId) {
                // Should only hit this if we just reconnected and the server is sending
                // Messages it has buffered, which would mean it hasn't seen an Ack for these messages
                this._ackTimer();
            }
            // Ignore, this is a duplicate message
            return false;
        }
        this._latestReceivedSequenceId = currentId;
        // Only start the timer for sending an Ack message when we have a message to ack. This also conveniently solves
        // timer throttling by not having a recursive timer, and by starting the timer via a network call (recv)
        this._ackTimer();
        return true;
    }
    _resetSequence(message) {
        if (message.sequenceId > this._nextReceivingSequenceId) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._connection.stop(new Error("Sequence ID greater than amount of messages we've received."));
            return;
        }
        this._nextReceivingSequenceId = message.sequenceId;
    }
    _disconnected() {
        this._reconnectInProgress = true;
        this._waitForSequenceMessage = true;
    }
    async _resend() {
        const sequenceId = this._messages.length !== 0
            ? this._messages[0]._id
            : this._totalMessageCount + 1;
        await this._connection.send(this._protocol.writeMessage({ type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Sequence, sequenceId }));
        // Get a local variable to the _messages, just in case messages are acked while resending
        // Which would slice the _messages array (which creates a new copy)
        const messages = this._messages;
        for (const element of messages) {
            await this._connection.send(element._message);
        }
        this._reconnectInProgress = false;
    }
    _dispose(error) {
        error !== null && error !== void 0 ? error : (error = new Error("Unable to reconnect to server."));
        // Unblock backpressure if any
        for (const element of this._messages) {
            element._rejector(error);
        }
    }
    _isInvocationMessage(message) {
        // There is no way to check if something implements an interface.
        // So we individually check the messages in a switch statement.
        // To make sure we don't miss any message types we rely on the compiler
        // seeing the function returns a value and it will do the
        // exhaustive check for us on the switch statement, since we don't use 'case default'
        switch (message.type) {
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Invocation:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.StreamItem:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Completion:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.StreamInvocation:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.CancelInvocation:
                return true;
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Close:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Sequence:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Ping:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Ack:
                return false;
        }
    }
    _ackTimer() {
        if (this._ackTimerHandle === undefined) {
            this._ackTimerHandle = setTimeout(async () => {
                try {
                    if (!this._reconnectInProgress) {
                        await this._connection.send(this._protocol.writeMessage({ type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Ack, sequenceId: this._latestReceivedSequenceId }));
                    }
                    // Ignore errors, that means the connection is closed and we don't care about the Ack message anymore.
                }
                catch { }
                clearTimeout(this._ackTimerHandle);
                this._ackTimerHandle = undefined;
                // 1 second delay so we don't spam Ack messages if there are many messages being received at once.
            }, 1000);
        }
    }
}
class BufferedItem {
    constructor(message, id, resolver, rejector) {
        this._message = message;
        this._id = id;
        this._resolver = resolver;
        this._rejector = rejector;
    }
}
//# sourceMappingURL=MessageBuffer.js.map

/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JsonHubProtocol: () => (/* binding */ JsonHubProtocol)
/* harmony export */ });
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(34);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(22);
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26);
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);
/* harmony import */ var _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(33);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





const JSON_HUB_PROTOCOL_NAME = "json";
/** Implements the JSON Hub Protocol. */
class JsonHubProtocol {
    constructor() {
        /** @inheritDoc */
        this.name = JSON_HUB_PROTOCOL_NAME;
        /** @inheritDoc */
        this.version = 2;
        /** @inheritDoc */
        this.transferFormat = _ITransport__WEBPACK_IMPORTED_MODULE_0__.TransferFormat.Text;
    }
    /** Creates an array of {@link @microsoft/signalr.HubMessage} objects from the specified serialized representation.
     *
     * @param {string} input A string containing the serialized representation.
     * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
     */
    parseMessages(input, logger) {
        // The interface does allow "ArrayBuffer" to be passed in, but this implementation does not. So let's throw a useful error.
        if (typeof input !== "string") {
            throw new Error("Invalid input for JSON hub protocol. Expected a string.");
        }
        if (!input) {
            return [];
        }
        if (logger === null) {
            logger = _Loggers__WEBPACK_IMPORTED_MODULE_1__.NullLogger.instance;
        }
        // Parse the messages
        const messages = _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__.TextMessageFormat.parse(input);
        const hubMessages = [];
        for (const message of messages) {
            const parsedMessage = JSON.parse(message);
            if (typeof parsedMessage.type !== "number") {
                throw new Error("Invalid payload.");
            }
            switch (parsedMessage.type) {
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation:
                    this._isInvocationMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem:
                    this._isStreamItemMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion:
                    this._isCompletionMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping:
                    // Single value, no need to validate
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close:
                    // All optional values, no need to validate
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ack:
                    this._isAckMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Sequence:
                    this._isSequenceMessage(parsedMessage);
                    break;
                default:
                    // Future protocol changes can add message types, old clients can ignore them
                    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, "Unknown message type '" + parsedMessage.type + "' ignored.");
                    continue;
            }
            hubMessages.push(parsedMessage);
        }
        return hubMessages;
    }
    /** Writes the specified {@link @microsoft/signalr.HubMessage} to a string and returns it.
     *
     * @param {HubMessage} message The message to write.
     * @returns {string} A string containing the serialized representation of the message.
     */
    writeMessage(message) {
        return _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__.TextMessageFormat.write(JSON.stringify(message));
    }
    _isInvocationMessage(message) {
        this._assertNotEmptyString(message.target, "Invalid payload for Invocation message.");
        if (message.invocationId !== undefined) {
            this._assertNotEmptyString(message.invocationId, "Invalid payload for Invocation message.");
        }
    }
    _isStreamItemMessage(message) {
        this._assertNotEmptyString(message.invocationId, "Invalid payload for StreamItem message.");
        if (message.item === undefined) {
            throw new Error("Invalid payload for StreamItem message.");
        }
    }
    _isCompletionMessage(message) {
        if (message.result && message.error) {
            throw new Error("Invalid payload for Completion message.");
        }
        if (!message.result && message.error) {
            this._assertNotEmptyString(message.error, "Invalid payload for Completion message.");
        }
        this._assertNotEmptyString(message.invocationId, "Invalid payload for Completion message.");
    }
    _isAckMessage(message) {
        if (typeof message.sequenceId !== 'number') {
            throw new Error("Invalid SequenceId for Ack message.");
        }
    }
    _isSequenceMessage(message) {
        if (typeof message.sequenceId !== 'number') {
            throw new Error("Invalid SequenceId for Sequence message.");
        }
    }
    _assertNotEmptyString(value, errorMessage) {
        if (typeof value !== "string" || value === "") {
            throw new Error(errorMessage);
        }
    }
}
//# sourceMappingURL=JsonHubProtocol.js.map

/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseLinkHub: () => (/* binding */ BaseLinkHub)
/* harmony export */ });
/* harmony import */ var _BaseSignalRHub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _ItemCollection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(39);


class BaseLinkHub {
    Hub;
    IC = new _ItemCollection__WEBPACK_IMPORTED_MODULE_1__.ItemCollection();
    CreateCB = new Set();
    UpdateCB = new Set();
    DeleteCB = new Set();
    constructor(hubName) {
        this.Hub = this.CreateHub(hubName);
        this.Hub.ServerCreate = this.ServerCreate;
        this.Hub.ServerUpdate = this.ServerUpdate;
        this.Hub.ServerDelete = this.ServerDelete;
    }
    CreateHub(hubName) {
        return new _BaseSignalRHub__WEBPACK_IMPORTED_MODULE_0__.BaseSignalRHub(hubName);
    }
    //#region Server responses
    ServerCreate = (item) => {
        for (const cb of this.CreateCB)
            cb(item);
    };
    get ServerReview() {
        return this.Hub.ServerReview;
    }
    set ServerReview(func) {
        this.Hub.ServerReview = func;
    }
    ServerUpdate = (args) => {
        for (const cb of this.UpdateCB)
            cb(args);
    };
    ServerDelete = (args) => {
        for (const cb of this.DeleteCB)
            cb(args);
        this.IC.Delete(args);
    };
    //#endregion
    //#region Register events
    OnCreate = (CB) => {
        this.CreateCB.add(CB);
        this.IC.All(CB);
    };
    OnUpdate = (CB) => {
        this.UpdateCB.add(CB);
    };
    OnDelete = (CB) => {
        this.DeleteCB.add(CB);
    };
}


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ItemCollection: () => (/* binding */ ItemCollection)
/* harmony export */ });
class ItemCollection {
    Items = new Set();
    Add = (item) => {
        this.Items.add(item);
    };
    Delete = (item) => {
        this.Items.delete(item);
    };
    GetItems = () => {
        return this.Items;
    };
    All = (callback) => {
        for (const item of this.Items)
            callback(item);
    };
}


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminMemberCard: () => (/* binding */ AdminMemberCard)
/* harmony export */ });
/* harmony import */ var _AdminBaseElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41);
/* harmony import */ var _BaseMemberCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(42);
/* harmony import */ var _Elements_Select_Select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(44);



class AdminMemberCard extends _BaseMemberCard__WEBPACK_IMPORTED_MODULE_1__.BaseMemberCard {
    FirstNameInput = document.createElement("input");
    LastNameInput = document.createElement("input");
    Team = new _Elements_Select_Select__WEBPACK_IMPORTED_MODULE_2__.Select();
    Admin;
    constructor() {
        super();
        this.FirstNameInput.required = true;
        this.LastNameInput.required = true;
        this.PresentDis = false;
        this.Team.Update = this._Update;
        this.TeamWrapper.append(this.Team.Element);
        this.Admin = new _AdminBaseElement__WEBPACK_IMPORTED_MODULE_0__.AdminBaseElement(this, this._Update, this._Delete);
    }
    Update;
    Delete;
    _Update = async () => {
        return await this.Update?.(this);
    };
    _Delete = async () => {
        return await this.Delete?.(this);
    };
}


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminBaseElement: () => (/* binding */ AdminBaseElement)
/* harmony export */ });
class AdminBaseElement {
    EditButton = document.createElement("button");
    DeleteButton = document.createElement("button");
    Card;
    _Update;
    _Delete;
    constructor(card, update, Delete) {
        this.Card = card;
        this.EditButton.textContent = "Edit";
        this.EditButton.onclick = this._Edit;
        this.DeleteButton.textContent = "Delete";
        this.DeleteButton.onclick = this.DeleteItem;
        this._Update = update;
        this._Delete = Delete;
    }
    ExtendEdit;
    ExtendConfirmBefore;
    ExtendConfirmAfter;
    ToggleInputVis;
    ToggleInput;
    ToggleAppend = (element, wrapper) => {
        if (element.parentElement) {
            element.remove();
        }
        else {
            wrapper.append(element);
        }
    };
    ToggleDisabled = (element) => {
        element.disabled = !element.disabled;
    };
    _Edit = () => {
        this.ExtendEdit?.();
        this.ToggleInputVis?.();
        this.EditButton.textContent = "Confirm";
        this.EditButton.onclick = this._Confirm;
    };
    _Confirm = async () => {
        if (!this.ExtendConfirmBefore?.())
            return;
        this.ToggleInput?.();
        await this._Update();
        this.ToggleInput?.();
        this.ToggleInputVis?.();
        this.ExtendConfirmAfter?.();
        this.EditButton.textContent = "Edit";
        this.EditButton.onclick = this._Confirm;
    };
    DeleteItem = async () => {
        if (!this._Delete)
            return console.log("No delete function defined on this item");
        this.Card.Element.style.pointerEvents = "none";
        this.Card.Element.style.opacity = "0.5";
        await this._Delete();
    };
}


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseMemberCard: () => (/* binding */ BaseMemberCard)
/* harmony export */ });
/* harmony import */ var _BaseElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);

class BaseMemberCard extends _BaseElement__WEBPACK_IMPORTED_MODULE_0__.BaseElement {
    NameSpan = document.createElement("h2");
    NameWrapper = document.createElement("div");
    Present = document.createElement("input");
    PresentLabel = document.createElement("span");
    PresentWrapper = document.createElement("div");
    TeamLabel = document.createElement("h4");
    TeamWrapper = document.createElement("div");
    constructor() {
        super();
        this.NameWrapper.append(this.NameSpan);
        this.Present.type = "checkbox";
        this.Present.disabled = true;
        this.PresentLabel.textContent = "Present";
        this.PresentWrapper.append(this.PresentLabel, this.Present);
        this.TeamLabel.textContent = "Team";
        this.TeamWrapper.append(this.TeamLabel);
    }
    get PresentCheck() {
        return this.Present.checked;
    }
    set PresentCheck(bool) {
        this.Present.checked = bool;
    }
    set PresentDis(bool) {
        this.Present.disabled = bool;
    }
    set PresentUpdate(func) {
        this.Present.onchange = func;
    }
}


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseElement: () => (/* binding */ BaseElement)
/* harmony export */ });
class BaseElement {
    Element = document.createElement("div");
    constructor() { }
}


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Select: () => (/* binding */ Select)
/* harmony export */ });
/* harmony import */ var _GeneralItems__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45);

class Select {
    Element = document.createElement("select");
    _Options = [];
    _ItemID = 0;
    SelectedOption;
    AllowSelectionChange = true;
    _AllowNull = true;
    Update;
    constructor(update) {
        this.Element.addEventListener("change", () => {
            const selectOption = this.Element.options[this.Element.selectedIndex];
            if (this.Update) {
                this.AllowSelectionChange = false;
                const option = this.Element.value;
                this.Element.value = this.SelectedOption;
                this.SelectedOption = option;
            }
            this.ID = this._Options.find((o) => o.Element == selectOption)?.ID ?? 0;
            this.Update?.(this);
        });
        this.AllowNull = this._AllowNull;
        this.Update = update;
        this.SelectedOption = this.Element.value;
    }
    set SelectOptions(options) {
        if (options.ID)
            this.ID = options.ID;
        if (options.AllowNull)
            this.AllowNull = options.AllowNull;
        if (options.Update)
            this.Update = options.Update;
    }
    get ID() {
        return this._ItemID;
    }
    set ID(id) {
        const matchingOption = this._Options.find((o) => o.ID === id);
        if (matchingOption && this.AllowSelectionChange) {
            matchingOption.SetSelect();
            this.SelectedOption = matchingOption.Element.value;
        }
        this.AllowSelectionChange = true;
        this._ItemID = id;
    }
    get AllowNull() {
        return this._AllowNull;
    }
    set AllowNull(bool) {
        this._AllowNull = bool;
        if (bool)
            this.CreateOption(0, "");
        else {
            this._Options.find((o) => o.ID == 0)?.Element.remove();
            this._Options = this._Options.filter((o) => o.ID === 0);
        }
    }
    CreateOption = (id, text) => {
        const option = new _GeneralItems__WEBPACK_IMPORTED_MODULE_0__.Option(id, text);
        this.AddOption(option);
    };
    UpdateOption = (id, text) => {
        const option = this._Options.find((o) => o.ID == id);
        if (option)
            option.Text = text;
    };
    DeleteOption = (id) => {
        const option = this._Options.find((o) => o.ID === id);
        if (option) {
            this._Options = this._Options.filter((o) => o.ID !== id);
            option.Element.remove();
        }
    };
    AddOption = (option) => {
        option.Element.selected = this.ID === option.ID;
        this.InsertOption(option);
    };
    InsertOption = (option) => {
        const index = this._Options.findIndex((o) => o.ID > option.ID);
        if (index == -1) {
            this._Options.push(option);
            this.Element.add(option.Element);
        }
        else {
            this._Options.splice(index, 0, option);
            this.Element.add(option.Element, index);
        }
    };
}


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminListItem: () => (/* binding */ AdminListItem),
/* harmony export */   AdminListWrapper: () => (/* binding */ AdminListWrapper),
/* harmony export */   ListItem: () => (/* binding */ ListItem),
/* harmony export */   ListWrapper: () => (/* binding */ ListWrapper),
/* harmony export */   ObservableArray: () => (/* binding */ ObservableArray),
/* harmony export */   Option: () => (/* binding */ Option)
/* harmony export */ });
/* harmony import */ var _Elements_Select_Select__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);

class ListWrapper {
    Wrapper = document.createElement("div");
    Label = document.createElement("h4");
    Items = new Map();
    constructor() { }
    Add = (item, id, element) => {
        this.Items.set(id, item);
        this.Wrapper.appendChild(element);
    };
    Update = (id, callback) => {
        if (this.Items.has(id))
            callback(this.Items.get(id));
    };
    GetItem = (id) => {
        return this.Items.get(id);
    };
    Remove = (id) => {
        this.Items.delete(id);
    };
    GetAll = () => {
        return Array.from(this.Items.values());
    };
    GetAllIDs = () => {
        return this.Items.keys();
    };
}
class AdminListWrapper extends ListWrapper {
    Select = new _Elements_Select_Select__WEBPACK_IMPORTED_MODULE_0__.Select();
    constructor() {
        super();
        this.Wrapper.append(this.Select.Element);
    }
    set AllowNull(bool) {
        this.Select.AllowNull = bool;
    }
}
class ListItem {
    Element = document.createElement("div");
    Label = document.createElement("p");
    _Text = "";
    constructor(text) {
        this.Element.append(this.Label);
        this.Text = text;
    }
    get Text() {
        return this._Text;
    }
    set Text(text) {
        this._Text = text;
        this.Label.textContent = text;
    }
}
class AdminListItem extends ListItem {
    Button = document.createElement("button");
    constructor(text, deleteFunc) {
        super(text);
        this.Button.textContent = "X";
        this.Button.onclick = deleteFunc;
        this.Element.append(this.Button);
    }
}
class Option {
    ID;
    Element;
    constructor(id, text) {
        const option = document.createElement("option");
        this.ID = id;
        this.Element = option;
        option.textContent = text;
    }
    set Text(text) {
        this.Element.textContent = text;
    }
    SetSelect = () => {
        this.Element.selected = true;
    };
}
class ObservableArray {
    items = new Map();
    onItemAdded;
    onItemDeleted;
    constructor() { }
    add = (item) => {
        this.items.set(item.ID, item);
        this.onItemAdded?.(item);
    };
    get = (id) => {
        return this.items.get(id);
    };
    find = (predicate) => {
        return Array.from(this.items.values()).find(predicate);
    };
    some = (predicate, thisArg) => {
        return Array.from(this.items.values()).some(predicate, thisArg);
    };
    delete = (number) => {
        const item = this.get(number);
        if (item)
            this.onItemDeleted?.(item);
        this.items.delete(number);
    };
    has = (number) => {
        return this.items.has(number);
    };
    getAll = () => {
        return this.items.values();
    };
}


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseMember: () => (/* binding */ BaseMember)
/* harmony export */ });
/* harmony import */ var _BaseItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47);

class BaseMember extends _BaseItem__WEBPACK_IMPORTED_MODULE_0__.BaseItem {
    _Present = true;
    _FirstName = "";
    _LastName = "";
    _TeamID = 0;
    constructor(item) {
        super(item.id);
    }
    Remove = () => {
        this.Card.Element.remove();
    };
    get Present() {
        return this._Present;
    }
    set Present(bool) {
        this._Present = bool;
        this.Card.PresentCheck = bool;
    }
    get FirstName() {
        return this._FirstName;
    }
    set FirstName(name) {
        this._FirstName = name;
        this.Card.NameSpan.textContent = name + " " + this._LastName;
    }
    get LastName() {
        return this._LastName;
    }
    set LastName(name) {
        this._LastName = name;
        this.Card.NameSpan.textContent = this._FirstName + " " + name;
    }
    get TeamID() {
        return this._TeamID;
    }
    set TeamID(id) {
        this._TeamID = id;
    }
}


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseItem: () => (/* binding */ BaseItem)
/* harmony export */ });
class BaseItem {
    ID;
    constructor(id) {
        this.ID = id;
    }
}


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminMemberLinkHub: () => (/* binding */ AdminMemberLinkHub),
/* harmony export */   MemberLinkHub: () => (/* binding */ MemberLinkHub)
/* harmony export */ });
/* harmony import */ var _BaseLinkHub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38);
/* harmony import */ var _AdminBaseLinkHub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);


class AdminMemberLinkHub extends _AdminBaseLinkHub__WEBPACK_IMPORTED_MODULE_1__.AdminBaseLinkHub {
    constructor() {
        super("MemberHub");
        this.ServerReview = this.ReviewMember;
    }
    CreateMember = (firstName, lastName, teamID) => {
        return this.Hub.Create(firstName, lastName, teamID);
    };
    ReviewMember = (members) => {
        for (const member of members) {
            for (const cb of this.CreateCB)
                cb(member);
            this.IC.Add(member);
        }
    };
    UpdateMember = (...arg) => {
        return this.Hub.Update(...arg);
    };
    DeleteMember = (...arg) => {
        return this.Hub.Delete(...arg);
    };
}
class MemberLinkHub extends _BaseLinkHub__WEBPACK_IMPORTED_MODULE_0__.BaseLinkHub {
    constructor() {
        super("MemberHub");
        this.ServerReview = this.ReviewMember;
    }
    ReviewMember = (members) => {
        for (const member of members) {
            for (const cb of this.CreateCB)
                cb(member);
            this.IC.Add(member);
        }
    };
}


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminBaseHub: () => (/* binding */ AdminBaseHub)
/* harmony export */ });
/* harmony import */ var _Hubs_BaseHub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(50);

class AdminBaseHub extends _Hubs_BaseHub__WEBPACK_IMPORTED_MODULE_0__.BaseHub {
    constructor(wrapper, newForm) {
        super(wrapper);
    }
}


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseHub: () => (/* binding */ BaseHub)
/* harmony export */ });
/* harmony import */ var _GeneralItems__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45);

class BaseHub {
    Wrapper;
    Items = new _GeneralItems__WEBPACK_IMPORTED_MODULE_0__.ObservableArray();
    constructor(wrapper) {
        this.Wrapper = wrapper;
        this.Items.onItemAdded = (item) => {
            wrapper.appendChild(item.Card.Element);
        };
        this.Items.onItemDeleted = (item) => {
            item.Remove();
        };
    }
    ExtendCreate;
    CreateItem = (serverItem) => {
        const item = this.ConstructItem(serverItem);
        this.Items.add(item);
        this.ExtendCreate?.(item);
        return item;
    };
}


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MemberForm: () => (/* binding */ MemberForm)
/* harmony export */ });
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52);
/* harmony import */ var _InputLabel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53);
/* harmony import */ var _Select_SelectWrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(56);



class MemberForm extends _BaseForm__WEBPACK_IMPORTED_MODULE_0__.BaseForm {
    FirstName = new _InputLabel__WEBPACK_IMPORTED_MODULE_1__.InputLabel();
    LastName = new _InputLabel__WEBPACK_IMPORTED_MODULE_1__.InputLabel();
    Team = new _Select_SelectWrapper__WEBPACK_IMPORTED_MODULE_2__.SelectWrapper();
    Submit;
    constructor() {
        super();
        this.FirstName = this.CreateInput(this.FirstName, {
            ClassName: "Member",
            Name: "FirstName",
            Placeholder: "FirstName",
            Type: "text",
            Required: true,
        });
        this.LastName = this.CreateInput(this.LastName, {
            ClassName: "Member",
            Name: "LastName",
            Placeholder: "LastName",
            Type: "text",
            Required: true,
        });
        this.CreateSelect(this.Team.Select);
        this.Team.text = "Team";
        this.Element.append(this.FirstName.Element, this.LastName.Element, this.Team.Element, this.SubmitButton);
    }
    ServerSubmit = async () => {
        return await this.Submit?.(this);
    };
    Reset = () => {
        this.FirstName.value = "";
        this.LastName.value = "";
        this.Team.Select.ID = 0;
    };
}


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseForm: () => (/* binding */ BaseForm)
/* harmony export */ });
/* harmony import */ var _InputLabel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53);

class BaseForm {
    Element = document.createElement("div");
    Inputs = new Set();
    SubmitButton = document.createElement("button");
    constructor() {
        this.SubmitButton.textContent = "Submit";
        this.SubmitButton.addEventListener("click", this._Submit);
    }
    ServerSubmit;
    IsDuplicate;
    Reset;
    _Submit = async (e) => {
        e.preventDefault;
        if (!this.CheckValidity())
            return;
        if (this.IsDuplicate && this.IsDuplicate?.()) {
            this.SubmitButton.setCustomValidity("There was a duplicate found with these inputs");
            this.SubmitButton.reportValidity();
            return;
        }
        await this.ServerSubmit?.();
        this.Reset?.();
    };
    CreateInput = (input, options) => {
        input = new _InputLabel__WEBPACK_IMPORTED_MODULE_0__.InputLabel(options);
        this.Inputs.add(input.Input.Element);
        return input;
    };
    CreateSelect = (select, options) => {
        this.Inputs.add(select.Element);
        if (options)
            select.SelectOptions = options;
    };
    CheckValidity = () => {
        for (const input of this.Inputs) {
            if (!input.required)
                continue;
            if (!input.checkValidity())
                return input.reportValidity();
        }
        return true;
    };
}


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InputLabel: () => (/* binding */ InputLabel)
/* harmony export */ });
/* harmony import */ var _BaseLabel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(55);


class InputLabel extends _BaseLabel__WEBPACK_IMPORTED_MODULE_0__.BaseLabel {
    Input = new _Input__WEBPACK_IMPORTED_MODULE_1__.Input();
    constructor(options) {
        super();
        this.Element.append(this.Input.Element);
        if (options) {
            this.Input.Options = options;
            this.Options = options;
        }
    }
    set Options(v) {
        super.Options = v;
        this.Input.Options = v;
    }
    get value() {
        return this.Input.Element.value;
    }
    set value(v) {
        this.Input.Element.value = v;
    }
}


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseLabel: () => (/* binding */ BaseLabel)
/* harmony export */ });
class BaseLabel {
    Label = document.createElement("label");
    Element = document.createElement("label");
    _For = "";
    constructor() {
        this.Element.append(this.Label);
    }
    set Options(options) {
        this.For = options.ClassName + options.Name;
        this.Label.textContent = options.Name;
    }
    get For() {
        return this._For;
    }
    set For(id) {
        this._For = id;
        this.Label.htmlFor = id;
        this.Element.htmlFor = id;
    }
}


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Input: () => (/* binding */ Input)
/* harmony export */ });
class Input {
    Element = document.createElement("input");
    _Required = false;
    _Placeholder = "";
    _ClassName = "";
    _Name = "";
    constructor(options) {
        if (options)
            this.Options = options;
    }
    set Options(options) {
        this.ClassName = options.ClassName;
        this.Name = options.Name;
        this.Placeholder = options.Placeholder;
        this.Type = options.Type;
        if (options.Required !== undefined)
            this.Required = options.Required;
    }
    get ClassName() {
        return this._ClassName;
    }
    set ClassName(v) {
        this._ClassName = v;
        this.Element.id = v + this._Name;
    }
    get Name() {
        return this._Name;
    }
    set Name(v) {
        this._Name = v;
        this.Element.id = this._ClassName + v;
    }
    get Required() {
        return this._Required;
    }
    set Required(v) {
        this._Required = v;
        this.Element.required = v;
    }
    get Placeholder() {
        return this._Placeholder;
    }
    set Placeholder(v) {
        this._Placeholder = v;
        this.Element.placeholder = v;
    }
    set Type(type) {
        this.Element.type = type;
    }
}


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectWrapper: () => (/* binding */ SelectWrapper)
/* harmony export */ });
/* harmony import */ var _Select__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);

class SelectWrapper {
    Element = document.createElement("div");
    Label = document.createElement("h4");
    Select = new _Select__WEBPACK_IMPORTED_MODULE_0__.Select();
    constructor(text) {
        if (text)
            this.Label.textContent = text;
        this.Element.append(this.Label, this.Select.Element);
    }
    set text(text) {
        this.Label.textContent = text;
    }
}


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminTeamHub: () => (/* binding */ AdminTeamHub)
/* harmony export */ });
/* harmony import */ var _Items_Team_AdminTeam__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(58);
/* harmony import */ var _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _LinksHubs_TeamLinkHub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
/* harmony import */ var _AdminBaseHub__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(49);
/* harmony import */ var _Elements_Forms_TeamForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(63);





class AdminTeamHub extends _AdminBaseHub__WEBPACK_IMPORTED_MODULE_3__.AdminBaseHub {
    Form = new _Elements_Forms_TeamForm__WEBPACK_IMPORTED_MODULE_4__.TeamForm();
    TeamLinkHub;
    constructor(wrapper, teamForm) {
        super(wrapper, teamForm);
        this.Wrapper.append(this.Form.Element);
        this.TeamLinkHub = _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_1__.HubFactory.GetInstance(_LinksHubs_TeamLinkHub__WEBPACK_IMPORTED_MODULE_2__.AdminTeamLinkHub);
        this.TeamLinkHub.OnCreate((item) => this.CreateItem(item));
        this.TeamLinkHub.OnUpdate((item) => {
            debugger;
            const team = this.Items.get(item.id);
            if (!team)
                return;
            team.Name = item.name;
            for (const member of item.sdTeamMembers) {
                if (!team.MemberIDS.has(member.id))
                    team.AddMember(member.id, member.firstName + " " + member.lastName);
            }
            for (const member of team.MemberIDS) {
                if (item.sdTeamMembers.length == 0)
                    team.RemoveMember(member);
                if (!item.sdTeamMembers.find((m) => m.id === member))
                    team.RemoveMember(member);
            }
            for (const trainer of item.sdUsers) {
                if (!team.TrainerIDS.has(trainer.id))
                    team.AddTrainer(trainer.id, trainer.name);
            }
            for (const Trainer of team.TrainerIDS) {
                if (item.sdUsers.length == 0)
                    team.RemoveTrainer(Trainer);
                if (!item.sdUsers.find((m) => m.id === Trainer))
                    team.RemoveTrainer(Trainer);
            }
        });
        this.TeamLinkHub.OnDelete((item) => {
            this.Items.get(item.id)?.Remove();
        });
    }
    ConstructItem = (card) => {
        const team = new _Items_Team_AdminTeam__WEBPACK_IMPORTED_MODULE_0__.AdminTeam(card, this.TeamLinkHub.UpdateTeam, this.TeamLinkHub.DeleteTeam);
        return team;
    };
}


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminTeam: () => (/* binding */ AdminTeam)
/* harmony export */ });
/* harmony import */ var _GeneralItems__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45);
/* harmony import */ var _Elements_Team_AdminTeamCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(59);
/* harmony import */ var _BaseTeam__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(61);
/* harmony import */ var _LinksHubs_MemberLinkHub__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(48);
/* harmony import */ var _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8);
/* harmony import */ var _LinksHubs_TrainerLinkHub__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(62);






class AdminTeam extends _BaseTeam__WEBPACK_IMPORTED_MODULE_2__.BaseTeam {
    Card = new _Elements_Team_AdminTeamCard__WEBPACK_IMPORTED_MODULE_1__.AdminTeamCard();
    _Update;
    _Delete;
    MemberLinkHub;
    TrainerLinkHub;
    constructor(item, updateT, deleteT) {
        super(item);
        this.Name = item.name;
        this._Update = updateT;
        this._Delete = deleteT;
        this.MemberIDS = new Set(item.sdTeamMembers.map((m) => m.id));
        this.TrainerIDS = new Set(item.sdUsers.map((u) => u.id));
        this.Card.Element.append(this.Card.NameWrapper, this.Card.Admin.EditButton, this.Card.TrainerWrapper.Label, this.Card.TrainerWrapper.Wrapper, this.Card.MemberWrapper.Label, this.Card.MemberWrapper.Wrapper, this.Card.Admin.DeleteButton);
        this.Card.Admin.ExtendConfirmBefore = () => this.Card.NameInput.value !== "";
        this.Card.Update = this.Update;
        this.Card.Delete = this.Delete;
        this.Card.Admin.ToggleInputVis = () => {
            this.Card.Admin.ToggleAppend(this.Card.NameInput, this.Card.NameWrapper);
            this.Card.Admin.ToggleAppend(this.Card.NameSpan, this.Card.NameWrapper);
        };
        this.Card.Admin.ToggleInput = () => {
            this.Card.Admin.ToggleDisabled(this.Card.NameInput);
        };
        this.MemberLinkHub = _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_4__.HubFactory.GetInstance(_LinksHubs_MemberLinkHub__WEBPACK_IMPORTED_MODULE_3__.AdminMemberLinkHub);
        this.TrainerLinkHub = _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_4__.HubFactory.GetInstance(_LinksHubs_TrainerLinkHub__WEBPACK_IMPORTED_MODULE_5__.AdminTrainerLinkHub);
        this.MemberLinkHub.OnCreate((item) => {
            if (this.ID == item.sdTeam_ID)
                return this.AddMember(item.id, item.firstName + " " + item.lastName);
            this.Card.MemberWrapper.Select.CreateOption(item.id, item.firstName + " " + item.lastName);
        });
        this.MemberLinkHub.OnUpdate((item) => {
            if (!item.sdTeam_ID || item.sdTeam_ID !== this.ID) {
                if (this.MemberIDS.has(item.id))
                    this.RemoveMember(item.id);
                return;
            }
            if (!this.MemberIDS.has(item.id))
                this.AddMember(item.id, `${item.firstName} ${item.lastName}`);
        });
        this.MemberLinkHub.OnDelete((item) => {
            if (this.MemberIDS.has(item.id))
                this.RemoveMember(item.id);
        });
        this.TrainerLinkHub.OnCreate((item) => {
            if (this.ID == item.sdTeam_ID)
                return this.AddTrainer(item.id, item.name);
            this.Card.TrainerWrapper.Select.CreateOption(item.id, item.name);
        });
        this.TrainerLinkHub.OnUpdate((item) => {
            if (!item.sdTeam_ID || item.sdTeam_ID !== this.ID) {
                if (this.TrainerIDS.has(item.id))
                    this.RemoveTrainer(item.id);
                return;
            }
            if (!this.TrainerIDS.has(item.sdTeam_ID))
                this.AddTrainer(item.sdTeam_ID, item.name);
        });
        this.TrainerLinkHub.OnDelete((item) => {
            if (this.TrainerIDS.has(item.id))
                this.RemoveTrainer(item.id);
        });
    }
    Update = async () => {
        return await this._Update(this.ID, this.Card.NameInput.value, Array.from(this.MemberIDS), Array.from(this.TrainerIDS));
    };
    Delete = async () => {
        return await this._Delete(this.ID);
    };
    set Name(name) {
        super.Name = name;
        this.Card.NameInput.value = name;
    }
    AddMember = (id, name) => {
        this._AddMember(id);
        const member = new _GeneralItems__WEBPACK_IMPORTED_MODULE_0__.AdminListItem(name, () => {
            this._DelMember(id);
            this.Update();
        });
        this.Card.MemberWrapper.Add(member, id, member.Element);
        this.Card.MemberWrapper.Select.DeleteOption(id);
    };
    RemoveMember = (id) => {
        this._DelMember(id);
        const item = this.Card.MemberWrapper.GetItem(id);
        item?.Element.remove();
        if (item)
            this.Card.MemberWrapper.Select.CreateOption(id, item.Text);
        this.Card.MemberWrapper.Remove(id);
    };
    AddTrainer = (id, name) => {
        this._AddTrainer(id);
        const trainer = new _GeneralItems__WEBPACK_IMPORTED_MODULE_0__.AdminListItem(name, () => {
            this._DelTrainer(id);
            this.Update();
        });
        this.Card.TrainerWrapper.Add(trainer, id, trainer.Element);
        this.Card.TrainerWrapper.Select.DeleteOption(id);
    };
    RemoveTrainer = (id) => {
        this._DelTrainer(id);
        const item = this.Card.TrainerWrapper.GetItem(id);
        item?.Element.remove();
        if (item)
            this.Card.TrainerWrapper.Select.CreateOption(id, item.Text);
        this.Card.TrainerWrapper.Remove(id);
    };
}


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminTeamCard: () => (/* binding */ AdminTeamCard)
/* harmony export */ });
/* harmony import */ var _GeneralItems__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45);
/* harmony import */ var _AdminBaseElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(41);
/* harmony import */ var _BaseTeamCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(60);



class AdminTeamCard extends _BaseTeamCard__WEBPACK_IMPORTED_MODULE_2__.BaseTeamCard {
    TrainerWrapper = new _GeneralItems__WEBPACK_IMPORTED_MODULE_0__.AdminListWrapper();
    MemberWrapper = new _GeneralItems__WEBPACK_IMPORTED_MODULE_0__.AdminListWrapper();
    NameInput = document.createElement("input");
    Admin;
    constructor() {
        super();
        this.NameInput.required = true;
        this.Admin = new _AdminBaseElement__WEBPACK_IMPORTED_MODULE_1__.AdminBaseElement(this, this._Update, this._Delete);
        this.MemberWrapper.Label.textContent = "Members";
        this.MemberWrapper.AllowNull = true;
        this.TrainerWrapper.Label.textContent = "Leaders";
        this.TrainerWrapper.AllowNull = true;
    }
    Update;
    Delete;
    _Update = async () => {
        return await this.Update?.(this);
    };
    _Delete = async () => {
        return await this.Delete?.(this);
    };
}


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseTeamCard: () => (/* binding */ BaseTeamCard)
/* harmony export */ });
/* harmony import */ var _BaseElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);

class BaseTeamCard extends _BaseElement__WEBPACK_IMPORTED_MODULE_0__.BaseElement {
    NameSpan = document.createElement("h2");
    NameWrapper = document.createElement("div");
    constructor() {
        super();
        this.NameWrapper.append(this.NameSpan);
    }
}


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseTeam: () => (/* binding */ BaseTeam)
/* harmony export */ });
/* harmony import */ var _BaseItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47);

class BaseTeam extends _BaseItem__WEBPACK_IMPORTED_MODULE_0__.BaseItem {
    _Name = "";
    _MemberIDS = new Set();
    _TrainerIDS = new Set();
    constructor(item) {
        super(item.id);
    }
    _AddMember = (id) => {
        this._MemberIDS.add(id);
    };
    _DelMember = (id) => {
        this._MemberIDS.delete(id);
    };
    _AddTrainer = (id) => {
        this._TrainerIDS.add(id);
    };
    _DelTrainer = (id) => {
        this._TrainerIDS.delete(id);
    };
    Remove = () => {
        this.Card.Element.remove();
    };
    get Name() {
        return this._Name;
    }
    set Name(name) {
        this._Name = name;
        this.Card.NameSpan.textContent = name;
    }
    get MemberIDS() {
        return this._MemberIDS;
    }
    set MemberIDS(set) {
        this._MemberIDS = set;
    }
    get TrainerIDS() {
        return this._TrainerIDS;
    }
    set TrainerIDS(set) {
        this._TrainerIDS = set;
    }
}


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminTrainerLinkHub: () => (/* binding */ AdminTrainerLinkHub)
/* harmony export */ });
/* harmony import */ var _AdminBaseLinkHub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);

class AdminTrainerLinkHub extends _AdminBaseLinkHub__WEBPACK_IMPORTED_MODULE_0__.AdminBaseLinkHub {
    constructor() {
        super("TrainerHub");
        this.ServerReview = this.ReviewTrainer;
    }
    CreateTrainer = (name, role, teamID) => {
        return this.Hub.Create(name, role, teamID);
    };
    ReviewTrainer = (trainers) => {
        for (const trainer of trainers) {
            for (const cb of this.CreateCB)
                cb(trainer);
            this.IC.Add(trainer);
        }
    };
    UpdateTrainer = (...arg) => {
        return this.Hub.Update(...arg);
    };
    DeleteTrainer = (...arg) => {
        return this.Hub.Delete(...arg);
    };
}
// export class TrainerLinkHub extends BaseLinkHub<Trainer> {}


/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TeamForm: () => (/* binding */ TeamForm)
/* harmony export */ });
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52);
/* harmony import */ var _InputLabel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53);


class TeamForm extends _BaseForm__WEBPACK_IMPORTED_MODULE_0__.BaseForm {
    Name = new _InputLabel__WEBPACK_IMPORTED_MODULE_1__.InputLabel();
    Submit;
    constructor() {
        super();
        this.Name = this.CreateInput(this.Name, {
            ClassName: "Team",
            Name: "Name",
            Placeholder: "Name",
            Type: "text",
            Required: true,
        });
        this.Element.append(this.Name.Element, this.SubmitButton);
    }
    ServerSubmit = async () => {
        return await this.Submit?.(this);
    };
    Reset = () => {
        this.Name.value = "";
    };
}


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminTrainerHub: () => (/* binding */ AdminTrainerHub)
/* harmony export */ });
/* harmony import */ var _Items_Trainer_AdminTrainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(65);
/* harmony import */ var _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _LinksHubs_TrainerLinkHub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(62);
/* harmony import */ var _AdminBaseHub__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(49);
/* harmony import */ var _Elements_Forms_TrainerForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(69);
/* harmony import */ var _LinksHubs_TeamLinkHub__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);
//#region  Imports






//#endregion
class AdminTrainerHub extends _AdminBaseHub__WEBPACK_IMPORTED_MODULE_3__.AdminBaseHub {
    Form = new _Elements_Forms_TrainerForm__WEBPACK_IMPORTED_MODULE_4__.TrainerForm();
    TeamLinkHub;
    TrainerLinkHub;
    constructor(wrapper, trainerForm) {
        super(wrapper, trainerForm);
        wrapper.append(this.Form.Element);
        this.Form.Submit = async (form) => {
            return await this.TrainerLinkHub.CreateTrainer(form.Name.value, false, form.Team.Select.ID);
        };
        this.TrainerLinkHub = _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_1__.HubFactory.GetInstance(_LinksHubs_TrainerLinkHub__WEBPACK_IMPORTED_MODULE_2__.AdminTrainerLinkHub);
        this.TrainerLinkHub.OnCreate((item) => this.CreateItem(item));
        this.TrainerLinkHub.OnUpdate((item) => {
            const trainer = this.Items.get(item.id);
            if (!trainer)
                return;
            trainer.Name = item.name;
            trainer.Role = item.role;
            trainer.TeamID = item.sdTeam_ID ?? 0;
        });
        this.TeamLinkHub = _LinksHubs_HubFactory__WEBPACK_IMPORTED_MODULE_1__.HubFactory.GetInstance(_LinksHubs_TeamLinkHub__WEBPACK_IMPORTED_MODULE_5__.AdminTeamLinkHub);
        this.TeamLinkHub.OnCreate((team) => this.Form.Team.Select.CreateOption(team.id, team.name));
        this.TeamLinkHub.OnUpdate((team) => this.Form.Team.Select.UpdateOption(team.id, team.name));
        this.TeamLinkHub.OnDelete((team) => this.Form.Team.Select.DeleteOption(team.id));
    }
    ConstructItem = (item) => {
        const trainer = new _Items_Trainer_AdminTrainer__WEBPACK_IMPORTED_MODULE_0__.AdminTrainer(item, this.TrainerLinkHub.UpdateTrainer, this.TrainerLinkHub.DeleteTrainer);
        return trainer;
    };
}


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminTrainer: () => (/* binding */ AdminTrainer)
/* harmony export */ });
/* harmony import */ var _Elements_Trainer_AdminTrainerCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(66);
/* harmony import */ var _BaseTrainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(68);


class AdminTrainer extends _BaseTrainer__WEBPACK_IMPORTED_MODULE_1__.BaseTrainer {
    Card = new _Elements_Trainer_AdminTrainerCard__WEBPACK_IMPORTED_MODULE_0__.AdminTrainerCard();
    _Update;
    _Delete;
    constructor(item, updateT, deleteT) {
        super(item);
        this.Name = item.name;
        this.Role = item.role;
        if (item.sdTeam_ID)
            this.TeamID = item.sdTeam_ID;
        this._Update = updateT;
        this._Delete = deleteT;
        if (item.sdTeam_ID && item.sdTeam_Name)
            this.Card.Team.CreateOption(item.sdTeam_ID, item.sdTeam_Name);
        this.Card.Element.append(this.Card.NameWrapper, this.Card.Admin.EditButton, this.Card.RoleWrapper, this.Card.TeamWrapper, this.Card.Admin.DeleteButton);
        this.Card.Admin.ExtendConfirmBefore = () => this.Card.NameInput.value !== "";
        this.Card.Update = this.Update;
        this.Card.Delete = this.Delete;
        this.Card.Admin.ToggleInputVis = () => {
            this.Card.Admin.ToggleAppend(this.Card.NameInput, this.Card.NameWrapper);
            this.Card.Admin.ToggleAppend(this.Card.NameSpan, this.Card.NameWrapper);
        };
        this.Card.Admin.ToggleInput = () => {
            this.Card.Admin.ToggleDisabled(this.Card.NameInput);
        };
    }
    Update = async () => {
        return await this._Update(this.ID, this.Card.NameInput.value, this.Card.RoleCheck, this.Card.Team.ID);
    };
    Delete = async () => {
        return await this._Delete(this.ID);
    };
    set TeamID(id) {
        super.TeamID = id;
        this.Card.Team.ID = id;
    }
}


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminTrainerCard: () => (/* binding */ AdminTrainerCard)
/* harmony export */ });
/* harmony import */ var _Elements_Select_Select__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _AdminBaseElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(41);
/* harmony import */ var _BaseTrainerCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(67);



class AdminTrainerCard extends _BaseTrainerCard__WEBPACK_IMPORTED_MODULE_2__.BaseTrainerCard {
    NameInput = document.createElement("input");
    Team = new _Elements_Select_Select__WEBPACK_IMPORTED_MODULE_0__.Select();
    Admin;
    constructor() {
        super();
        this.NameInput.required = true;
        this.RoleDis = false;
        this.Team.Update = this._Update;
        this.TeamWrapper.append(this.Team.Element);
        this.Admin = new _AdminBaseElement__WEBPACK_IMPORTED_MODULE_1__.AdminBaseElement(this, this._Update, this._Delete);
    }
    Update;
    Delete;
    _Update = async () => {
        return await this.Update?.(this);
    };
    _Delete = async () => {
        return await this.Delete?.(this);
    };
}


/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseTrainerCard: () => (/* binding */ BaseTrainerCard)
/* harmony export */ });
/* harmony import */ var _BaseElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);

class BaseTrainerCard extends _BaseElement__WEBPACK_IMPORTED_MODULE_0__.BaseElement {
    NameSpan = document.createElement("h2");
    NameWrapper = document.createElement("div");
    Role = document.createElement("input");
    RoleLabel = document.createElement("span");
    RoleWrapper = document.createElement("div");
    TeamLabel = document.createElement("h4");
    TeamWrapper = document.createElement("div");
    constructor() {
        super();
        this.NameWrapper.append(this.NameSpan);
        this.Role.type = "checkbox";
        this.Role.disabled = true;
        this.RoleLabel.textContent = "Admin";
        this.RoleWrapper.append(this.RoleLabel, this.Role);
        this.TeamLabel.textContent = "Team";
        this.TeamWrapper.append(this.TeamLabel);
    }
    get RoleCheck() {
        return this.Role.checked;
    }
    set RoleCheck(bool) {
        this.Role.checked = !bool;
    }
    set RoleDis(bool) {
        this.Role.disabled = bool;
    }
}


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseTrainer: () => (/* binding */ BaseTrainer)
/* harmony export */ });
/* harmony import */ var _BaseItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47);

class BaseTrainer extends _BaseItem__WEBPACK_IMPORTED_MODULE_0__.BaseItem {
    _Role = true;
    _Name = "";
    _TeamID = 0;
    constructor(item) {
        super(item.id);
    }
    Remove = () => {
        this.Card.Element.remove();
    };
    get Role() {
        return this._Role;
    }
    set Role(bool) {
        this._Role = bool;
        this.Card.RoleCheck = bool;
    }
    get Name() {
        return this._Name;
    }
    set Name(name) {
        this._Name = name;
        this.Card.NameSpan.textContent = name;
    }
    get TeamID() {
        return this._TeamID;
    }
    set TeamID(id) {
        this._TeamID = id;
    }
}


/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TrainerForm: () => (/* binding */ TrainerForm)
/* harmony export */ });
/* harmony import */ var _Select_SelectWrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56);
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(52);
/* harmony import */ var _InputLabel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(53);



class TrainerForm extends _BaseForm__WEBPACK_IMPORTED_MODULE_1__.BaseForm {
    Name = new _InputLabel__WEBPACK_IMPORTED_MODULE_2__.InputLabel();
    Team = new _Select_SelectWrapper__WEBPACK_IMPORTED_MODULE_0__.SelectWrapper();
    Submit;
    constructor() {
        super();
        this.Name = this.CreateInput(this.Name, {
            ClassName: "Team",
            Name: "Name",
            Placeholder: "Name",
            Type: "text",
            Required: true,
        });
        this.CreateSelect(this.Team.Select);
        this.Team.text = "Team";
        this.Element.append(this.Name.Element, this.Team.Element, this.SubmitButton);
    }
    Reset = () => {
        this.Name.value = "";
        this.Team.Select.ID = 0;
    };
    ServerSubmit = async () => {
        return await this.Submit?.(this);
    };
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Models_New_Hubs_Member_AdminMemberHub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _Models_New_Hubs_Team_AdminTeamHub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(57);
/* harmony import */ var _Models_New_Hubs_Trainer_AdminTrainerHub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64);



function initializeHub(wrapperId, HubClass) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper)
        throw new Error(`Element with id ${wrapperId} not found`);
    const tmpHub = new HubClass(wrapper);
}
initializeHub("MembersCard", _Models_New_Hubs_Member_AdminMemberHub__WEBPACK_IMPORTED_MODULE_0__.AdminMemberHub);
initializeHub("TeamsCard", _Models_New_Hubs_Team_AdminTeamHub__WEBPACK_IMPORTED_MODULE_1__.AdminTeamHub);
initializeHub("TrainersCard", _Models_New_Hubs_Trainer_AdminTrainerHub__WEBPACK_IMPORTED_MODULE_2__.AdminTrainerHub);

/******/ })()
;