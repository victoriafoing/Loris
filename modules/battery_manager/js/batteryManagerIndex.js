!function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}([function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_FilterForm=__webpack_require__(1),_FilterForm2=_interopRequireDefault(_FilterForm),_Tabs=__webpack_require__(3),_addEntry=__webpack_require__(4),_addEntry2=_interopRequireDefault(_addEntry),BatteryManagerIndex=function(_React$Component){function BatteryManagerIndex(props){_classCallCheck(this,BatteryManagerIndex);var _this=_possibleConstructorReturn(this,(BatteryManagerIndex.__proto__||Object.getPrototypeOf(BatteryManagerIndex)).call(this,props));return loris.hiddenHeaders=[],_this.state={isLoaded:!1,filter:{}},_this.fetchData=_this.fetchData.bind(_this),_this.updateFilter=_this.updateFilter.bind(_this),_this.resetFilters=_this.resetFilters.bind(_this),_this.formatColumn=_this.formatColumn.bind(_this),_this.deactivateEntry=_this.deactivateEntry.bind(_this),_this}return _inherits(BatteryManagerIndex,_React$Component),_createClass(BatteryManagerIndex,[{key:"componentDidMount",value:function(){this.fetchData()}},{key:"fetchData",value:function(){$.ajax(this.props.DataURL,{method:"GET",dataType:"json",success:function(data){this.setState({Data:data,isLoaded:!0})}.bind(this),error:function(_error){console.error(_error)}})}},{key:"updateFilter",value:function(filter){this.setState({filter:filter})}},{key:"resetFilters",value:function(){this.refs.batteryManagerFilter.clearFilter()}},{key:"render",value:function(){if(!this.state.isLoaded)return React.createElement("button",{className:"btn-info has-spinner"},"Loading",React.createElement("span",{className:"glyphicon glyphicon-refresh glyphicon-refresh-animate"}));var addTab=void 0,tabList=[{id:"browse",label:"Browse"}];return loris.userHasPermission("battery_manager_edit")&&(tabList.push({id:"add",label:"Add"}),addTab=React.createElement(_Tabs.TabPane,{TabId:tabList[1].id},React.createElement(_addEntry2.default,{DataURL:loris.BaseURL+"/battery_manager/ajax/get_form_data.php?action=getFormData",checkForDuplicate:loris.BaseURL+"/battery_manager/ajax/add_entry.php?action=checkForDuplicate",activate:loris.BaseURL+"/battery_manager/ajax/update_entry.php?action=activate",add:loris.BaseURL+"/battery_manager/ajax/add_entry.php?action=add"}))),React.createElement(_Tabs.Tabs,{tabs:tabList,defaultTab:"browse",updateURL:!0},React.createElement(_Tabs.TabPane,{TabId:tabList[0].id},React.createElement(_FilterForm2.default,{Module:"battery_manager",name:"battery_manager_filter",id:"battery_manager_filter_form",ref:"batteryManagerFilter",columns:3,formElements:this.state.Data.form,onUpdate:this.updateFilter,filter:this.state.filter},React.createElement("br",null),React.createElement(ButtonElement,{label:"Clear Filters",type:"reset",onUserInput:this.resetFilters})),React.createElement(StaticDataTable,{Data:this.state.Data.Data,Headers:this.state.Data.Headers,Filter:this.state.filter,getFormattedCell:this.formatColumn})),addTab)}},{key:"formatColumn",value:function(column,cell,rowData,rowHeaders){var _this2=this;if(loris.hiddenHeaders.indexOf(column)>-1)return null;var row={};rowHeaders.forEach(function(header,index){row[header]=rowData[index]},this);var classes=[];if(classes=classes.join(" "),"Deactivate"===column){if("Y"===row.Active){var entryID=row.Deactivate,idObj=new FormData;return idObj.append("ID",entryID),React.createElement("td",{className:classes},React.createElement("button",{onClick:function(){_this2.deactivateEntry(idObj)}},"Deactivate"))}return React.createElement("td",{className:classes})}return React.createElement("td",{className:classes},cell)}},{key:"deactivateEntry",value:function(idObj){swal({title:"Are you sure you want to deactivate this entry?",type:"warning",showCancelButton:!0,confirmButtonText:"Yes",cancelButtonText:"Cancel",closeOnConfirm:!1},function(){$.ajax({type:"POST",url:this.props.deactivate,data:idObj,cache:!1,contentType:!1,processData:!1}).done(function(data){swal({title:"Deactivated!",type:"success"},function(){location.reload()})}).error(function(data){swal("Could not deactivate entry","","error")})}.bind(this))}}]),BatteryManagerIndex}(React.Component);$(function(){var batteryManagerIndex=React.createElement("div",{className:"page-battery-manager"},React.createElement(BatteryManagerIndex,{DataURL:loris.BaseURL+"/battery_manager/?format=json",deactivate:loris.BaseURL+"/battery_manager/ajax/update_entry.php?action=deactivate"}));ReactDOM.render(batteryManagerIndex,document.getElementById("lorisworkspace"))})},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),_Panel=__webpack_require__(2),_Panel2=_interopRequireDefault(_Panel),FilterForm=function(_React$Component){function FilterForm(props){_classCallCheck(this,FilterForm);var _this=_possibleConstructorReturn(this,(FilterForm.__proto__||Object.getPrototypeOf(FilterForm)).call(this,props));return _this.clearFilter=_this.clearFilter.bind(_this),_this.getFormChildren=_this.getFormChildren.bind(_this),_this.setFilter=_this.setFilter.bind(_this),_this.onElementUpdate=_this.onElementUpdate.bind(_this),_this.queryString=QueryString.get(),_this}return _inherits(FilterForm,_React$Component),_createClass(FilterForm,[{key:"componentDidMount",value:function(){var filter={},queryString=this.queryString;Object.keys(queryString).forEach(function(key){var filterKey="candidateID"===key?"candID":key;filter[filterKey]={value:queryString[key],exactMatch:!1}}),this.props.onUpdate(filter)}},{key:"clearFilter",value:function(){this.queryString=QueryString.clear(this.props.Module),this.props.onUpdate({})}},{key:"getFormChildren",value:function(){var formChildren=[];return React.Children.forEach(this.props.children,function(child,key){if(React.isValidElement(child)&&"function"==typeof child.type&&child.props.onUserInput){var callbackFunc=child.props.onUserInput,callbackName=callbackFunc.name,elementName=child.type.displayName,queryFieldName="candID"===child.props.name?"candidateID":child.props.name,filterValue=this.queryString[queryFieldName];"onUserInput"===callbackName&&(callbackFunc="ButtonElement"===elementName&&"reset"===child.props.type?this.clearFilter:this.onElementUpdate.bind(null,elementName)),formChildren.push(React.cloneElement(child,{onUserInput:callbackFunc,value:filterValue?filterValue:"",key:key})),this.setFilter(elementName,child.props.name,filterValue)}else formChildren.push(React.cloneElement(child,{key:key}))}.bind(this)),formChildren}},{key:"setFilter",value:function(type,key,value){var filter={};return this.props.filter&&(filter=JSON.parse(JSON.stringify(this.props.filter))),key?(filter[key]={},value?filter[key].value=Object.keys(value).length>0?value:"":filter[key].value="",filter[key].exactMatch="SelectElement"===type):filter&&key&&""===value&&delete filter[key],filter}},{key:"onElementUpdate",value:function(type,fieldName,fieldValue){if("string"==typeof fieldName&&("string"==typeof fieldValue||"object"===("undefined"==typeof fieldValue?"undefined":_typeof(fieldValue)))){var queryFieldName="candID"===fieldName?"candidateID":fieldName;this.queryString=QueryString.set(this.queryString,queryFieldName,fieldValue);var filter=this.setFilter(type,fieldName,fieldValue);this.props.onUpdate(filter)}}},{key:"render",value:function(){var formChildren=this.getFormChildren(),formElements=this.props.formElements;return formElements&&Object.keys(formElements).forEach(function(fieldName){var queryFieldName="candID"===fieldName?"candidateID":fieldName;formElements[fieldName].onUserInput=this.onElementUpdate.bind(null,fieldName),formElements[fieldName].value=this.queryString[queryFieldName]}.bind(this)),React.createElement(_Panel2.default,{id:this.props.id,height:this.props.height,title:this.props.title},React.createElement(FormElement,this.props,formChildren))}}]),FilterForm}(React.Component);FilterForm.defaultProps={id:"selection-filter",height:"100%",title:"Selection Filter",onUpdate:function(){console.warn("onUpdate() callback is not set!")}},FilterForm.propTypes={Module:React.PropTypes.string.isRequired,filter:React.PropTypes.object.isRequired,id:React.PropTypes.string,height:React.PropTypes.string,title:React.PropTypes.string,onUpdate:React.PropTypes.func},exports.default=FilterForm},function(module,exports){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),Panel=function(_React$Component){function Panel(props){_classCallCheck(this,Panel);var _this=_possibleConstructorReturn(this,(Panel.__proto__||Object.getPrototypeOf(Panel)).call(this,props));return _this.state={collapsed:_this.props.initCollapsed},_this.panelClass=_this.props.initCollapsed?"panel-collapse collapse":"panel-collapse collapse in",_this.toggleCollapsed=_this.toggleCollapsed.bind(_this),_this}return _inherits(Panel,_React$Component),_createClass(Panel,[{key:"toggleCollapsed",value:function(){this.setState({collapsed:!this.state.collapsed})}},{key:"render",value:function(){var glyphClass=this.state.collapsed?"glyphicon pull-right glyphicon-chevron-down":"glyphicon pull-right glyphicon-chevron-up",panelHeading=this.props.title?React.createElement("div",{className:"panel-heading",onClick:this.toggleCollapsed,"data-toggle":"collapse","data-target":"#"+this.props.id,style:{cursor:"pointer"}},this.props.title,React.createElement("span",{className:glyphClass})):"";return React.createElement("div",{className:"panel panel-primary"},panelHeading,React.createElement("div",{id:this.props.id,className:this.panelClass,role:"tabpanel"},React.createElement("div",{className:"panel-body",style:{height:this.props.height}},this.props.children)))}}]),Panel}(React.Component);Panel.propTypes={id:React.PropTypes.string,height:React.PropTypes.string,title:React.PropTypes.string},Panel.defaultProps={initCollapsed:!1,id:"default-panel",height:"100%"},exports.default=Panel},function(module,exports){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),Tabs=function(_React$Component){function Tabs(props){_classCallCheck(this,Tabs);var _this=_possibleConstructorReturn(this,(Tabs.__proto__||Object.getPrototypeOf(Tabs)).call(this,props)),hash=window.location.hash,activeTab="";return _this.props.updateURL&&hash?activeTab=hash.substr(1):_this.props.defaultTab?activeTab=_this.props.defaultTab:_this.props.tabs.length>0&&(activeTab=_this.props.tabs[0].id),_this.state={activeTab:activeTab},_this.handleClick=_this.handleClick.bind(_this),_this.getTabs=_this.getTabs.bind(_this),_this.getTabPanes=_this.getTabPanes.bind(_this),_this}return _inherits(Tabs,_React$Component),_createClass(Tabs,[{key:"handleClick",value:function(tabId,e){if(this.setState({activeTab:tabId}),this.props.onTabChange(tabId),this.props.updateURL){var scrollDistance=$("body").scrollTop()||$("html").scrollTop();window.location.hash=e.target.hash,$("html,body").scrollTop(scrollDistance)}}},{key:"getTabs",value:function(){var tabs=this.props.tabs.map(function(tab){var tabClass=this.state.activeTab===tab.id?"active":null,href="#"+tab.id,tabID="tab-"+tab.id;return React.createElement("li",{role:"presentation",className:tabClass,key:tab.id},React.createElement("a",{id:tabID,href:href,role:"tab","data-toggle":"tab",onClick:this.handleClick.bind(null,tab.id)},tab.label))}.bind(this));return tabs}},{key:"getTabPanes",value:function(){var tabPanes=React.Children.map(this.props.children,function(child,key){if(child)return React.cloneElement(child,{activeTab:this.state.activeTab,key:key})}.bind(this));return tabPanes}},{key:"render",value:function(){var tabs=this.getTabs(),tabPanes=this.getTabPanes(),tabStyle={marginLeft:0,marginBottom:"5px"};return React.createElement("div",null,React.createElement("ul",{className:"nav nav-tabs",role:"tablist",style:tabStyle},tabs),React.createElement("div",{className:"tab-content"},tabPanes))}}]),Tabs}(React.Component);Tabs.propTypes={tabs:React.PropTypes.array.isRequired,defaultTab:React.PropTypes.string,updateURL:React.PropTypes.bool},Tabs.defaultProps={onTabChange:function(){},updateURL:!0};var VerticalTabs=function(_React$Component2){function VerticalTabs(props){_classCallCheck(this,VerticalTabs);var _this2=_possibleConstructorReturn(this,(VerticalTabs.__proto__||Object.getPrototypeOf(VerticalTabs)).call(this,props)),hash=window.location.hash,activeTab="";return _this2.props.updateURL&&hash?activeTab=hash.substr(1):_this2.props.defaultTab?activeTab=_this2.props.defaultTab:_this2.props.tabs.length>0&&(activeTab=_this2.props.tabs[0].id),_this2.state={activeTab:activeTab},_this2.handleClick=_this2.handleClick.bind(_this2),_this2.getTabs=_this2.getTabs.bind(_this2),_this2.getTabPanes=_this2.getTabPanes.bind(_this2),_this2}return _inherits(VerticalTabs,_React$Component2),_createClass(VerticalTabs,[{key:"handleClick",value:function(tabId,e){if(this.setState({activeTab:tabId}),this.props.onTabChange(tabId),this.props.updateURL){var scrollDistance=$("body").scrollTop()||$("html").scrollTop();window.location.hash=e.target.hash,$("html,body").scrollTop(scrollDistance)}}},{key:"getTabs",value:function(){var tabs=this.props.tabs.map(function(tab){var tabClass=this.state.activeTab===tab.id?"active":null,href="#"+tab.id,tabID="tab-"+tab.id;return React.createElement("li",{role:"presentation",className:tabClass,key:tab.id},React.createElement("a",{id:tabID,href:href,role:"tab","data-toggle":"tab",onClick:this.handleClick.bind(null,tab.id)},tab.label))}.bind(this));return tabs}},{key:"getTabPanes",value:function(){var tabPanes=React.Children.map(this.props.children,function(child,key){if(child)return React.cloneElement(child,{activeTab:this.state.activeTab,key:key})}.bind(this));return tabPanes}},{key:"render",value:function(){var tabs=this.getTabs(),tabPanes=this.getTabPanes(),tabStyle={marginLeft:0,marginBottom:"5px"};return React.createElement("div",null,React.createElement("div",{className:"tabbable col-md-3 col-sm-3"},React.createElement("ul",{className:"nav nav-pills nav-stacked",role:"tablist",style:tabStyle},tabs)),React.createElement("div",{className:"tab-content col-md-9 col-sm-9"},tabPanes))}}]),VerticalTabs}(React.Component);VerticalTabs.propTypes={tabs:React.PropTypes.array.isRequired,defaultTab:React.PropTypes.string,updateURL:React.PropTypes.bool},VerticalTabs.defaultProps={onTabChange:function(){},updateURL:!0};var TabPane=function(_React$Component3){function TabPane(){return _classCallCheck(this,TabPane),_possibleConstructorReturn(this,(TabPane.__proto__||Object.getPrototypeOf(TabPane)).apply(this,arguments))}return _inherits(TabPane,_React$Component3),_createClass(TabPane,[{key:"render",value:function(){var classList="tab-pane",title=void 0;return this.props.TabId===this.props.activeTab&&(classList+=" active"),this.props.Title&&(title=React.createElement("h1",null,this.props.Title)),React.createElement("div",{role:"tabpanel",className:classList,id:this.props.TabId},title,this.props.children)}}]),TabPane}(React.Component);TabPane.propTypes={TabId:React.PropTypes.string.isRequired,Title:React.PropTypes.string,activeTab:React.PropTypes.string},exports.Tabs=Tabs,exports.VerticalTabs=VerticalTabs,exports.TabPane=TabPane},function(module,exports){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),BatteryManagerAddForm=function(_React$Component){function BatteryManagerAddForm(props){_classCallCheck(this,BatteryManagerAddForm);var _this=_possibleConstructorReturn(this,(BatteryManagerAddForm.__proto__||Object.getPrototypeOf(BatteryManagerAddForm)).call(this,props));return _this.state={Data:{},formData:{},isLoaded:!1,loadedData:0},_this.setFormData=_this.setFormData.bind(_this),_this.handleAdd=_this.handleAdd.bind(_this),_this.isDuplicate=_this.isDuplicate.bind(_this),_this.giveOptions=_this.giveOptions.bind(_this),_this.activateEntry=_this.activateEntry.bind(_this),_this.addEntry=_this.addEntry.bind(_this),_this}return _inherits(BatteryManagerAddForm,_React$Component),_createClass(BatteryManagerAddForm,[{key:"componentDidMount",value:function(){var self=this;$.ajax(this.props.DataURL,{dataType:"json",success:function(data){self.setState({Data:data,isLoaded:!0})},error:function(data,errorCode,errorMsg){console.error(data,errorCode,errorMsg),self.setState({error:"An error occurred when loading the form!"})}})}},{key:"render",value:function(){if(void 0!==this.state.error)return React.createElement("div",{className:"alert alert-danger text-center"},React.createElement("strong",null,this.state.error));if(!this.state.isLoaded)return React.createElement("button",{className:"btn-info has-spinner"},"Loading",React.createElement("span",{className:"glyphicon glyphicon-refresh glyphicon-refresh-animate"}));var helpText=React.createElement("span",null,"You cannot add an entry if it has a duplicate entry in the test battery.",React.createElement("br",null),"If the duplicate entry is inactive, you will be given the option to activate it.");return React.createElement("div",{className:"row"},React.createElement("div",{className:"col-md-8 col-lg-7"},React.createElement(FormElement,{name:"batteryAdd",fileUpload:!0,onSubmit:this.handleAdd,ref:"form"},React.createElement("h3",null,"Add entry to Test Battery"),React.createElement("br",null),React.createElement(StaticElement,{label:"Note",text:helpText}),React.createElement(SelectElement,{name:"instrument",label:"Instrument",options:this.state.Data.instruments,onUserInput:this.setFormData,ref:"instrument",required:!0,value:this.state.formData.instrument}),React.createElement(NumericElement,{name:"ageMinDays",label:"Minimum age",onUserInput:this.setFormData,ref:"ageMinDays",required:!0,min:"0",max:"99999",value:this.state.formData.ageMinDays}),React.createElement(NumericElement,{name:"ageMaxDays",label:"Maximum age",onUserInput:this.setFormData,ref:"ageMaxDays",required:!0,min:"0",max:"99999",value:this.state.formData.ageMaxDays}),React.createElement(SelectElement,{name:"stage",label:"Stage",options:this.state.Data.stages,onUserInput:this.setFormData,ref:"stage",hasError:!1,required:!0,value:this.state.formData.stage}),React.createElement(SelectElement,{name:"subproject",label:"Subproject",options:this.state.Data.subprojects,onUserInput:this.setFormData,ref:"subproject",hasError:!1,required:!1,value:this.state.formData.subproject}),React.createElement(SelectElement,{name:"visitLabel",label:"Visit Label",options:this.state.Data.visits,onUserInput:this.setFormData,ref:"visitLabel",required:!1,value:this.state.formData.visitLabel}),React.createElement(SearchableDropdown,{name:"forSite",label:"Site",placeHolder:"Search for site",options:this.state.Data.sites,strictSearch:!0,onUserInput:this.setFormData,ref:"forSite",required:!1,value:this.state.formData.forSite}),React.createElement(SelectElement,{name:"firstVisit",label:"First Visit",options:this.state.Data.firstVisits,onUserInput:this.setFormData,ref:"firstVisit",required:!1,value:this.state.formData.firstVisit}),React.createElement(NumericElement,{name:"instrumentOrder",label:"Instrument Order",onUserInput:this.setFormData,ref:"instrumentOrder",required:!1,min:"0",max:"127",value:this.state.formData.instrumentOrder}),React.createElement(ButtonElement,{label:"Add entry"}))))}},{key:"handleAdd",value:function(e){e.preventDefault();var formData=this.state.formData,formObj=new FormData;for(var key in formData)""!==formData[key]&&formObj.append(key,formData[key]);this.isDuplicate(formObj,this.giveOptions)}},{key:"isDuplicate",value:function(formObj,callback){$.ajax({type:"POST",url:this.props.checkForDuplicate,data:formObj,cache:!1,contentType:!1,processData:!1,success:callback,error:function(err){console.error(err),swal("Could not check","","error")}})}},{key:"giveOptions",value:function(duplicateEntry){if(Object.keys(duplicateEntry).length>0){var duplicateEntryJSON=JSON.parse(duplicateEntry),entryID=duplicateEntryJSON.ID,idObj=new FormData;idObj.append("ID",entryID),"N"===duplicateEntryJSON.Active?swal({title:"Deactivated entry!",text:"A deactivated entry with these values already exists!\n Would you like to reactivate this entry?",type:"warning",showCancelButton:!0,confirmButtonText:"Yes",cancelButtonText:"Cancel",closeOnConfirm:!1},function(){this.activateEntry(idObj)}.bind(this)):"Y"===duplicateEntryJSON.Active&&swal({title:"Duplicate entry!",text:"This entry already exists in the database",type:"error"})}else this.addEntry()}},{key:"activateEntry",value:function(idObj){$.ajax({type:"POST",url:this.props.activate,data:idObj,cache:!1,contentType:!1,processData:!1}).done(function(data){swal({title:"Activated!",type:"success"},function(){window.location.assign(loris.BaseURL+"/battery_manager/")})}).error(function(data){swal("Could not activate entry","","error")})}},{key:"addEntry",value:function(){var formData=this.state.formData,formObj=new FormData;for(var key in formData)""!==formData[key]&&formObj.append(key,formData[key]);$.ajax({type:"POST",url:this.props.add,data:formObj,cache:!1,contentType:!1,processData:!1,success:function(){this.setState({formData:{}}),swal({title:"Entry Successful!",type:"success"},function(){window.location.assign(loris.BaseURL+"/battery_manager/")})}.bind(this),error:function(err){console.error(err),swal("Could not insert","","error")}})}},{key:"setFormData",value:function(formElement,value){var formData=this.state.formData;formData[formElement]=value,this.setState({formData:formData})}}]),BatteryManagerAddForm}(React.Component);BatteryManagerAddForm.propTypes={DataURL:React.PropTypes.string.isRequired,add:React.PropTypes.string.isRequired,activate:React.PropTypes.string.isRequired,checkForDuplicate:React.PropTypes.string.isRequired},exports.default=BatteryManagerAddForm}]);
//# sourceMappingURL=batteryManagerIndex.js.map