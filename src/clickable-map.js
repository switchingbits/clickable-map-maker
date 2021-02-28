/*
    ClickableMapMaker.com - Clickable map website software
    Copyright (C) 2021  ClickableMapMaker.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/> 

    Source code available at: https://github.com/switchingbits/clickable-map-maker
*/

var ClickableMap = {};

(function() { 
    var version = '1.0.0';
    var classPrefix = 'cmm-usa-';
    var creditLinkUrl = 'https://www.clickablemapmaker.com';
    var stateCount = 0;
    var maxTableColumns = 5;
    var global = this;

    // Static public helpers
    this.getEleById = function(id) {
        return document.getElementById(id);
    };
    this.getEleByQuery = function(query) {
        return document.querySelector(query);
    };
    this.stateIdToDomClass = function(stateId) {
        return classPrefix + 'state-' + stateId.toLowerCase();
    }; 
    this.version = version;
    
    // Private helpers
    function createBaseGlobalData() {
        return {
            version: version,
            width: '800',
            widthUnits: 'px',
            fontSize: '12px',
            fontName: 'Arial',
            fill: '#97e2bb',
            hoverFill: '#ffffff',
            disabledFill: '#c2c2c2',
            backgroundFill: '#ffffff',
            innerLabelColor: '#000000',
            outerLabelColor: '#000000',
            hoverLabelColor: '#D64933',
            borderType: null,
            borderStroke: '#49bc95',
            enableShadows: true,
            popLink: false,
            showStateTitleAndDescOnHover: true,
            showLinksList: false,
            globalLinkUrl: null,
            globalJsCallback: null,
            mapTitle: 'Choose your state below',
            creditLink: 'Create a clickable USA map at ClickableMapMaker.com'
        };
    }

    // States data
    function createBaseStatesData() {
        var statesData = {
            AL: {fullName: 'Alabama'}, 
            AK: {fullName: 'Alaska'}, 
            AZ: {fullName: 'Arizona'}, 
            AR: {fullName: 'Arkansas'}, 
            CA: {fullName: 'California'}, 
            CO: {fullName: 'Colorado'}, 
            CT: {fullName: 'Connecticut'}, 
            DE: {fullName: 'Delaware'}, 
            DC: {fullName: 'District Of Columbia'}, 
            FL: {fullName: 'Florida'}, 
            GA: {fullName: 'Georgia'}, 
            HI: {fullName: 'Hawaii'}, 
            ID: {fullName: 'Idaho'}, 
            IL: {fullName: 'Illinois'}, 
            IN: {fullName: 'Indiana'}, 
            IA: {fullName: 'Iowa'}, 
            KS: {fullName: 'Kansas'}, 
            KY: {fullName: 'Kentucky'}, 
            LA: {fullName: 'Louisiana'}, 
            ME: {fullName: 'Maine'}, 
            MD: {fullName: 'Maryland'}, 
            MA: {fullName: 'Massachusetts'}, 
            MI: {fullName: 'Michigan'}, 
            MN: {fullName: 'Minnesota'}, 
            MS: {fullName: 'Mississippi'}, 
            MO: {fullName: 'Missouri'}, 
            MT: {fullName: 'Montana'}, 
            NE: {fullName: 'Nebraska'}, 
            NV: {fullName: 'Nevada'}, 
            NH: {fullName: 'New Hampshire'}, 
            NJ: {fullName: 'New Jersey'}, 
            NM: {fullName: 'New Mexico'}, 
            NY: {fullName: 'New York'}, 
            NC: {fullName: 'North Carolina'}, 
            ND: {fullName: 'North Dakota'}, 
            OH: {fullName: 'Ohio'}, 
            OK: {fullName: 'Oklahoma'}, 
            OR: {fullName: 'Oregon'}, 
            PA: {fullName: 'Pennsylvania'}, 
            RI: {fullName: 'Rhode Island'}, 
            SC: {fullName: 'South Carolina'}, 
            SD: {fullName: 'South Dakota'}, 
            TN: {fullName: 'Tennessee'}, 
            TX: {fullName: 'Texas'}, 
            UT: {fullName: 'Utah'}, 
            VT: {fullName: 'Vermont'}, 
            VA: {fullName: 'Virginia'}, 
            WA: {fullName: 'Washington'}, 
            WV: {fullName: 'West Virginia'}, 
            WI: {fullName: 'Wisconsin'}, 
            WY: {fullName: 'Wyoming'}
        };
        
        // Setup state extended properties
        for(var stateId in statesData) {
            if(!statesData.hasOwnProperty(stateId)) {
                continue;
            }
            statesData[stateId].title = statesData[stateId].fullName;
            statesData[stateId].description = null;
            statesData[stateId].longDescription = null;
            statesData[stateId].linkUrl = null;
            statesData[stateId].isDisabled = false;
            statesData[stateId].isHovering = false;
            statesData[stateId].cssClass = null;
            statesData[stateId].overrideFill = null;
            statesData[stateId].overrideFillEnabled = false;
            statesData[stateId].overrideHoverFill = null;
            statesData[stateId].overrideHoverFillEnabled = false;
            statesData[stateId].overridePopLink = null,
            stateCount++;
        }
        return statesData;
    }

    // Hover state event
    function stateOn(stateId) {
        if(this.statesData[stateId].isHovering) {
            return;
        }
        this.statesData[stateId].isHovering = true;
        var $stateLink = global.getEleByQuery('#' + this.$map.id + ' .' + global.stateIdToDomClass(stateId));
        var $statePath = global.getEleByQuery('#' + this.$map.id + ' .' + global.stateIdToDomClass(stateId) + ' path');
        var $stateText = global.getEleByQuery('#' + this.$map.id + ' .' + global.stateIdToDomClass(stateId) + ' text');

        // State fill coloring
        if(this.statesData[stateId].isDisabled) {
            $statePath.style.fill = this.globalData.disabledFill;
            $stateLink.style.cursor = 'default';
        }
        else if(this.statesData[stateId].overrideHoverFillEnabled && this.statesData[stateId].overrideHoverFill != null) {
            $statePath.style.fill = this.statesData[stateId].overrideHoverFill;
            $stateText.style.fill = this.globalData.hoverLabelColor;
            $stateLink.style.cursor = 'pointer';
        }
        else {
            $statePath.style.fill = this.globalData.hoverFill;
            $stateText.style.fill = this.globalData.hoverLabelColor;
            $stateLink.style.cursor = 'pointer';
        }

        // Show current state chosen on mouse over
        if(this.globalData.showStateTitleAndDescOnHover) {
            var $hoverStateInfo = global.getEleByQuery('#' + this.$map.id + ' .' + classPrefix + 'hover-state-info');            
            var titleText = this.statesData[stateId].title == null ? '' : this.statesData[stateId].title;
            var descText = this.statesData[stateId].description == null ? '' : this.statesData[stateId].description;
            var longDescText = this.statesData[stateId].longDescription == null ? '' : this.statesData[stateId].longDescription;
            var titleSpan = document.createElement('span');
            var descSpan = document.createElement('span');
            titleSpan.textContent = titleText;
            if(longDescText != '') {
                descSpan.innerHTML = longDescText;
            }
            else {
                descSpan.textContent = descText;
            }
            while($hoverStateInfo.firstChild) {
                $hoverStateInfo.removeChild($hoverStateInfo.firstChild);
            }
            $hoverStateInfo.appendChild(titleSpan);
            $hoverStateInfo.appendChild(descSpan);
            $hoverStateInfo.style.display = 'block';
        }

        // Show shadowing
        if(!this.statesData[stateId].isDisabled && this.globalData.enableShadows) {
            statePathBlur = $statePath.cloneNode(true);
            statePathBlur.setAttribute('filter', 'url(#' + this.$map.id + '-blur-filter)');
            statePathBlur.setAttribute('class', classPrefix + 'state-shadow');
            $stateLink.parentNode.appendChild(statePathBlur);
            $stateLink.parentNode.appendChild($stateLink);
        }
    }
    
    // Hover off state event
    function stateOff(stateId) {
        this.statesData[stateId].isHovering = false;
        var $statePath = global.getEleByQuery('#' + this.$map.id + ' .' + global.stateIdToDomClass(stateId) + ' path');
        var $stateText = global.getEleByQuery('#' + this.$map.id + ' .' + global.stateIdToDomClass(stateId) + ' text');
        var isOuterLabel = $stateText.getAttribute('class') == classPrefix + 'outer-label';

        // Hide state info on mouseout
        if(this.globalData.showStateTitleAndDescOnHover) {
            var $hoverStateInfo = global.getEleByQuery('#' + this.$map.id + ' .' + classPrefix + 'hover-state-info');
            $hoverStateInfo.style.display = 'none';
        }
        
        // Reset coloring
        if(this.statesData[stateId].isDisabled) {
            $statePath.style.fill = this.globalData.disabledFill;
        }
        else if(this.statesData[stateId].overrideFillEnabled && this.statesData[stateId].overrideFill != null) {
            $statePath.style.fill = this.statesData[stateId].overrideFill;
            $stateText.style.fill = isOuterLabel ? this.globalData.outerLabelColor : this.globalData.innerLabelColor;
        }
        else {
            $statePath.style.fill = this.globalData.fill;
            $stateText.style.fill = isOuterLabel ? this.globalData.outerLabelColor : this.globalData.innerLabelColor;
        }

        // Remove shadows
        var allShadows = document.querySelectorAll('#' + this.$map.id + ' .' + classPrefix + 'state-shadow');
        Array.prototype.map.call(
            Array.prototype.slice.call(allShadows),
            function(ele) {
                ele.parentNode.removeChild(ele);
            }
        );
    }

    this.create = function(wrapperId) {
        return new this.mapObject(wrapperId);
    };

    this.mapObject = function(wrapperId) {
        this.$map = global.getEleById(wrapperId);
        this.globalData = createBaseGlobalData();
        this.statesData = createBaseStatesData();
        
        // Setup state mouseovers
        for(var stateId in this.statesData) {
            if(!this.statesData.hasOwnProperty(stateId)) {
                continue;
            }

            // Set fill if disabled, otherwise, attach mouse handlers
            (function(stateId) {
                var $stateLink = global.getEleByQuery('#' + this.$map.id + ' .' + global.stateIdToDomClass(stateId));
                var self = this;
                $stateLink.addEventListener('mouseover', function(e) {
                    stateOn.call(self, stateId);
                });
                $stateLink.addEventListener('mouseout', function(e) {
                    stateOff.call(self, stateId);
                });
                $stateLink = null;
            }.call(this, stateId));
        }
                
        // Get an ID on the shadow
        global.getEleByQuery('#' + this.$map.id + ' .' + classPrefix + 'blur-filter').setAttribute('id', this.$map.id + '-blur-filter');
    };

    // Get dom ID
    this.mapObject.prototype.getDomId = function() {
        return this.$map.id;
    };

    // Update map display
    this.mapObject.prototype.draw = function() {
        // Global level properties
        this.$map.style.width = this.globalData.width + this.globalData.widthUnits;
        this.$map.style.backgroundColor = this.globalData.backgroundFill;
        this.$map.style.fontFamily = this.globalData.fontName;
        this.$map.style.fontSize = this.globalData.fontSize;
        global.getEleByQuery('#' + this.$map.id + ' .' + classPrefix + 'title').textContent = this.globalData.mapTitle;
        if(this.globalData.creditLink != null && this.globalData.creditLink != '') {
            global.getEleByQuery('#' + this.$map.id + ' .' + classPrefix + 'credit-link').innerHTML = '<a target="_blank" href="' + creditLinkUrl + '"></a>';
            global.getEleByQuery('#' + this.$map.id + ' .' + classPrefix + 'credit-link a').textContent = this.globalData.creditLink;
        }
        else {
            global.getEleByQuery('#' + this.$map.id + ' .' + classPrefix + 'credit-link').innerHTML = '';
        }

        // State properties
        for(var stateId in this.statesData) {
            if(!this.statesData.hasOwnProperty(stateId)) {
                continue;
            }
            var stateDomClass = global.stateIdToDomClass(stateId);

            // Update accesibility properties
            var $stateTitle = global.getEleByQuery('#' + this.$map.id + ' .' + stateDomClass + ' title');
            var $stateDescription = global.getEleByQuery('#' + this.$map.id + ' .' + stateDomClass + ' desc');
            $stateTitle.textContent = this.statesData[stateId].title;
            $stateDescription.textContent = this.statesData[stateId].description;

            // Update visual properties
            var $statePath = global.getEleByQuery('#' + this.$map.id + ' .' + stateDomClass + ' path');
            $statePath.style.stroke = this.globalData.borderStroke;

            if(this.globalData.borderType != null) {
                $statePath.style.strokeDasharray = this.globalData.borderType;
            }
            else {
                $statePath.style.strokeDasharray = 'none';
            }

            if(this.statesData[stateId].isDisabled) {
                $statePath.style.fill = this.globalData.disabledFill;
            }
            else if(this.statesData[stateId].overrideFillEnabled && this.statesData[stateId].overrideFill != null) {
                $statePath.style.fill = this.statesData[stateId].overrideFill;
            }
            else {
                $statePath.style.fill = this.globalData.fill;
            }

            var $allLabels = document.querySelectorAll('#' + this.$map.id + ' .' + stateDomClass + ' text');
            for(var i = 0; i < $allLabels.length; ++i) {
                $allLabels.item(i).style.fill = this.globalData.innerLabelColor;
            }

            // Wire state click handlers
            this.wireStateLink(stateId, false);
        }

        // State label override for "outer" labels
        var $outerLabels = document.querySelectorAll('#' + this.$map.id + ' .' + classPrefix + 'outer-label');
        for(var i = 0; i < $outerLabels.length; ++i) {
            $outerLabels.item(i).style.fill = this.globalData.outerLabelColor;
        }

        // Draw the link list, if enabled
        if(this.globalData.showLinksList) {
            this.displayMapLinksList();
        }
        else {
            global.getEleByQuery('#' + this.$map.id + ' .' + classPrefix + 'listview').innerHTML = '';
        }

        // Display the map
        this.$map.style.display = 'block';
    };

    // Get global data
    this.mapObject.prototype.getGlobalData = function() {
        return this.globalData;
    };

    // Get states data
    this.mapObject.prototype.getStatesData = function() {
        return this.statesData;
    };

    // Set global data
    this.mapObject.prototype.setGlobalData = function(data) {
        for(var setting in this.globalData) {
            if(!this.globalData.hasOwnProperty(setting) || !data.hasOwnProperty(setting)) {
                continue;
            }
            this.globalData[setting] = data[setting];
        }
    };

     // Set states data
    this.mapObject.prototype.setStatesData = function(data) {
        for(var state in this.statesData) {
            if(!this.statesData.hasOwnProperty(state) || !data.hasOwnProperty(state)) {
                continue;
            }
            for(var setting in this.statesData[state]) {
                if(!this.statesData[state].hasOwnProperty(setting) || !data[state].hasOwnProperty(setting)) {
                    continue;
                }
                this.statesData[state][setting] = data[state][setting];
            }
        }
    };

    // Live state links
    this.mapObject.prototype.wireStateLink = function(stateId, addLiveClassName, linkType) {
        var clickFn = null;
        linkType = linkType ? linkType : '';
        var $stateLink = global.getEleByQuery('#' + this.$map.id + ' .' + global.stateIdToDomClass(stateId) + linkType);

        // Add css class if needed
        if(this.statesData[stateId].cssClass != null) {
            $stateLink.setAttribute('class', $stateLink.getAttribute('class') + ' ' + this.statesData[stateId].cssClass);
        }

        // Disabled state
        if(this.statesData[stateId].isDisabled) {
            clickFn = null;
        }
        // State specific URL
        else if(this.statesData[stateId].linkUrl != null) {
            var self = this;
            clickFn = function(e) {
                var isPop = false;
                if(self.statesData[stateId].overridePopLink != null) {
                    isPop = self.statesData[stateId].overridePopLink;
                }
                else if(self.globalData.popLink) {
                    isPop = true;
                }
                if(isPop) {
                    window.open(self.statesData[stateId].linkUrl);
                }
                else {
                    document.location.href = self.statesData[stateId].linkUrl;
                }
            };
        }
        // Global link URL
        else if(this.globalData.globalLinkUrl != null) {
            var self = this;
            clickFn = function(e) {
                var normalizedUrl = self.globalData.globalLinkUrl.replaceAll('@state', stateId);
                var isPop = false;
                if(self.statesData[stateId].overridePopLink != null) {
                    isPop = self.statesData[stateId].overridePopLink;
                }
                else if(self.globalData.popLink) {
                    isPop = true;
                }
                if(isPop) {
                    window.open(normalizedUrl);
                }
                else {
                    document.location.href = normalizedUrl;
                }
            };
        }
        // Global Javascript callback
        else if(this.globalData.globalJsCallback != null) {
            var self = this;
            clickFn = function(e) {
                var fn = window[self.globalData.globalJsCallback];
                if(typeof fn == 'function') {
                    fn(stateId);
                }
                else {
                    console.log('Unable to execute function: ' + self.globalData.globalJsCallback + '("' + stateId + '")');
                }
            };
        }

        // Finally, assign the function
        $stateLink.onclick = clickFn;

        // Add class for live links styling
        if(addLiveClassName) {
            var liveLinkClassName = classPrefix + 'live-link';
            $stateLink.className = $stateLink.className.replace(' ' + liveLinkClassName, '');
            if(clickFn != null) {
                $stateLink.className = $stateLink.className + ' ' + liveLinkClassName;
            }
        }
    };

    // Display map links list
    this.mapObject.prototype.displayMapLinksList = function() {
        var $linkList = global.getEleByQuery('#' + this.$map.id + ' .' + classPrefix + 'listview');
        var allListsHtml = '';
        var stateIds = [];
        for(var stateId in this.statesData) {
            if(!this.statesData.hasOwnProperty(stateId)) {
                continue;
            }
            stateIds.push(stateId);
        }
        var widthPercent = Math.floor(100 / maxTableColumns);
        var itemsPerList = Math.ceil(stateCount / maxTableColumns);
        var sliceStart = 0;
        for(var i = 0; i < maxTableColumns; ++i) {
            var slicedIds = stateIds.slice(sliceStart, sliceStart + itemsPerList);
            sliceStart += itemsPerList;
            if(slicedIds.length > 0) {
                var ul = document.createElement('UL');
                ul.style.maxWidth = widthPercent + '%';
                for(var x = 0; x < slicedIds.length; ++x) {
                    var li = document.createElement('LI');
                    li.appendChild(document.createElement('SPAN'));
                    var a = document.createElement('A');
                    a.className = classPrefix + 'state-' + slicedIds[x].toLowerCase() + '-listview';
                    a.textContent = this.statesData[slicedIds[x]].title;
                    li.appendChild(a);
                    ul.appendChild(li);
                }
                $linkList.appendChild(ul);
            }
        }

        // Calculate the links for states
        for(var stateId in this.statesData) {
            if(!this.statesData.hasOwnProperty(stateId)) {
                continue;
            }
            this.wireStateLink(stateId, true, '-listview');
        }
    };

    // Export if available
    if(typeof exports !== 'undefined') {
        module.exports = this;
    }
}).apply(ClickableMap);

