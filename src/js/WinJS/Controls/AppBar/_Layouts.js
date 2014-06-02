// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/// <dictionary>animatable,appbar,appbars,divs,Flyout,Flyouts,iframe,Statics,unfocus,unselectable</dictionary>
(function overlayInit(WinJS) {
    "use strict";

    // Common Class Names
    var primaryCommandsClass = "win-primarygroup",
        secondaryCommandsClass = "win-secondarygroup",
        appBarCommandClass = "win-command";

    // Constants for AppBarCommands
    var typeSeparator = "separator",
        typeContent = "content",
        separatorWidth = 60,
        buttonWidth = 100;

    WinJS.Namespace.define("WinJS.UI", {
        _AppBarCommandsLayout: WinJS.Namespace._lazy(function () {

            var layoutClass = "win-commandlayout";

            var _AppBarCommandsLayout = WinJS.Class.define(function _AppBarCommandsLayout_ctor(element) {
                /// <signature helpKeyword="WinJS.UI._AppBarCommandsLayout">
                /// <summary locid="WinJS.UI._AppBarCommandsLayout">
                /// Constructor for private AppBar 'commands' layout implementation.
                /// </summary>
                /// <param name="appbaelementrEl" type="HTMLElement" domElement="true" locid="WinJS.UI._AppBarCommandsLayout_p:element">
                /// The DOM element belonging to the AppBar control.
                /// </param>                
                /// <returns type="WinJS.UI._AppBarCommandsLayout" locid="WinJS.UI._AppBarCommandsLayout_returnValue"
                /// >A fully constructed Overlay control.
                /// </returns>
                /// </signature>
                this._initLayout(element);
            }, {
                // Members
                className: {
                    get: function _AppBarCommandsLayout_getClassName() {
                        return layoutClass;
                    }
                },
                getWidthOfPrimaryRow: function _AppBarCommandsLayout_getWidthOfPrimaryRow(newSetOfVisibleCommands) {
                    // Commands layout put primary commands and seconary commands into the primary row.
                    // Return the total width of all visible primary and secondary commands.
                    //

                    if (!newSetOfVisibleCommands) {
                        // Return the cached width of last known visible commands in the AppBar.
                        return this._widthOfRelevantCommands;
                    } else {
                        // Return the width of the specified commands.
                        var separatorsCount = 0;
                        var buttonsCount = 0;
                        var accumulatedWidth = 0;
                        var command;
                        for (var i = 0, len = newSetOfVisibleCommands.length; i < len; i++) {
                            command = newSetOfVisibleCommands[i].winControl || newSetOfVisibleCommands[i];
                            if (command._type === typeSeparator) {
                                separatorsCount++
                            } else if (command._type !== typeContent) {
                                // button, toggle, and flyout types all have the same width.
                                buttonsCount++;
                            } else {
                                accumulatedWidth += command._fullSizeWidth;
                            }
                        }
                    }
                    return accumulatedWidth += (separatorsCount * separatorWidth) + (buttonsCount * buttonWidth);
                },
                _getFocusableCommandsInLogicalOrder: function _AppBarLayouts_getCommandsInLogicalOrder(globalCommandHasFocus) {
                    // Function returns an array of all the contained AppBarCommands which are reachable by left/right arrows.
                    //
                    var selectionCommands = this._secondaryCommands.children,
                        globalCommands = this._primaryCommands.children,
                        focusedIndex = -1;

                    var getFocusableCommandsHelper = function (commandsInReach) {
                        // Helper function 
                        var focusableCommands = [];
                        for (var i = 0, len = commandsInReach.length; i < len; i++) {
                            var element = commandsInReach[i];
                            if (WinJS.Utilities.hasClass(element, appBarCommandClass) && element.winControl) {
                                var containsFocus = element.contains(document.activeElement);
                                // With the inclusion of content type commands, it may be possible to tab to elements in AppBarCommands that are not reachable by arrow keys.
                                // Regardless, when an AppBarCommand contains the element with focus, we just include the whole command so that we can determine which
                                // Commands are adjacent to it when looking for the next focus destination.
                                if (element.winControl._isFocusable() || containsFocus) {
                                    focusableCommands.push(element);
                                    if (containsFocus) {
                                        focusedIndex = focusableCommands.length - 1;
                                    }
                                }
                            }
                        }
                        return focusableCommands;
                    }

                    // Determine which set of commands that the user could potentially reach through Home, End, and arrow keys.
                    // All commands in the AppBar from left to right are in reach. Selection then Global.
                    var commandsInReach = Array.prototype.slice.call(selectionCommands).concat(Array.prototype.slice.call(globalCommands));

                    var focusableCommands = getFocusableCommandsHelper(commandsInReach);
                    focusableCommands.focusedIndex = focusedIndex;
                    return focusableCommands;
                },
            });
            WinJS.Class.mix(_AppBarCommandsLayout, _AppBarLayoutsMixin);
            return _AppBarCommandsLayout;
        }),
    });


    // These are functions and properties that a new layout would shaare with the existing commands layout.
    var _AppBarLayoutsMixin = {
        _initLayout: function _AppBarLayouts_init(appbarEl) {
            // Create layout infrastructure
            this._primaryCommands = document.createElement("DIV");
            this._secondaryCommands = document.createElement("DIV");
            WinJS.Utilities.addClass(this._primaryCommands, primaryCommandsClass);
            WinJS.Utilities.addClass(this._secondaryCommands, secondaryCommandsClass);
            if (appbarEl) {
                this.connect(appbarEl);
            }
        },
        connect: function _AppBarLayouts_connect(appbarEl) {
            WinJS.Utilities.addClass(appbarEl, this.className)
            this.appbarEl = appbarEl;
        },
        layout: function _AppBarLayouts_layout(commands) {

            // Empty our tree.
            WinJS.Utilities.empty(this._primaryCommands);
            WinJS.Utilities.empty(this._secondaryCommands);

            // Keep track of the order we receive the commands in.
            this._commandsInOriginalOrder = [];

            // Layout commands
            for (var i = 0, len = commands.length; i < len; i++) {
                var command = this.appbarEl.winControl._sanitizeCommand(commands[i]);

                this._commandsInOriginalOrder.push(command.element);

                if ("global" === command.section) {
                    this._primaryCommands.appendChild(command._element);
                } else {
                    this._secondaryCommands.appendChild(command._element);
                }
            }

            // Append layout to AppBar element
            this.appbarEl.appendChild(this._primaryCommands);
            this.appbarEl.appendChild(this._secondaryCommands);
        },
        // Gets an Array of the AppBarCommand Elements the layout is using, in the same order that the layout recieved them in.
        commands: {
            get: function () {
                return this._commandsInOriginalOrder.filter(function (command) {
                    // Make sure the element is still in the AppBar.
                    return this.appbarEl.contains(command);
                }, this);
            }
        },
        dispose: function _AppBarLayouts_dispose() {
            WinJS.Utilities.disposeSubTree(this._primaryCommands);
            WinJS.Utilities.disposeSubTree(this._secondaryCommands);
        },
        disconnect: function _AppBarLayouts_disconnect() {
            WinJS.Utilities.removeClass(this.appbarEl, this.className);
            this.appbarEl = null;
        },
        handleKeyDown: function _AppBarLayouts_handleKeyDown(event) {
            var Key = WinJS.Utilities.Key;

            if (WinJS.Utilities._matchesSelector(event.target, ".win-interactive, .win-interactive *")) {
                return; //ignore left, right, home & end keys if focused element has win-interactive class.
            }
            var rtl = getComputedStyle(this.appbarEl).direction === "rtl";
            var leftKey = rtl ? Key.rightArrow : Key.leftArrow;
            var rightKey = rtl ? Key.leftArrow : Key.rightArrow;

            if (event.keyCode === leftKey || event.keyCode == rightKey || event.keyCode === Key.home || event.keyCode === Key.end) {

                var globalCommandHasFocus = this._primaryCommands.contains(document.activeElement);
                var focusableCommands = this._getFocusableCommandsInLogicalOrder(globalCommandHasFocus);
                var targetCommand;

                if (focusableCommands.length) {
                    switch (event.keyCode) {
                        case leftKey:
                            // Arrowing past the last command wraps back around to the first command.
                            var index = Math.max(-1, focusableCommands.focusedIndex - 1) + focusableCommands.length;
                            targetCommand = focusableCommands[index % focusableCommands.length].winControl.lastElementFocus;
                            break;

                        case rightKey:
                            // Arrowing previous to the first command wraps back around to the last command.
                            var index = focusableCommands.focusedIndex + 1 + focusableCommands.length;
                            targetCommand = focusableCommands[index % focusableCommands.length].winControl.firstElementFocus;
                            break;

                        case Key.home:
                            var index = 0;
                            targetCommand = focusableCommands[index].winControl.firstElementFocus;
                            break;

                        case Key.end:
                            var index = focusableCommands.length - 1;
                            targetCommand = focusableCommands[index].winControl.lastElementFocus;
                            break;
                    }
                }

                if (targetCommand) {
                    targetCommand.focus();
                    // Prevent default so that Trident doesn't resolve the keydown event on the newly focused element.
                    event.preventDefault();
                }
            }
        },        
        takeFocus: function _AppBarLayouts_takeFocus() {
            // layout should take focus and put it on its first command.
            var globalCommandHasFocus = this._primaryCommands.contains(document.activeElement);
            var firstCommand = this._getFocusableCommandsInLogicalOrder(globalCommandHasFocus)[0].winControl.firstElementFocus;
            if (firstCommand) {
                firstCommand.focus();
            }
        },
        contentChanged: function _AppBarLayouts_contentChanged(newSetOfVisibleCommands) {
            // Whenever new commands are set or existing commands are hidden/shown in the AppBar, this
            // function is called to update the cached width measurement of all visible AppBarCommands.
            this._widthOfRelevantCommands = 0;

            // Gather visible commands.
            var visibleCommands = (newSetOfVisibleCommands) ? newSetOfVisibleCommands : this.commands.filter(function (command) {
                return !command.winControl.hidden;
            });
            this._widthOfRelevantCommands = this.getWidthOfPrimaryRow(visibleCommands);
        },
    }

})(WinJS);

