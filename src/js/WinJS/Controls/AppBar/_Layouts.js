// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/// <dictionary>animatable,appbar,appbars,divs,Flyout,Flyouts,iframe,Statics,unfocus,unselectable</dictionary>
(function appBarLayoutsInit(WinJS) {
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

            var commandsLayoutClass = "win-commandlayout";

            var _AppBarCommandsLayout = WinJS.Class.define(function _AppBarCommandsLayout_ctor(appBarElement) {
                this._initLayout(appBarElement);
            }, {
                // Members
                className: {
                    get: function _AppBarCustomLayout_getClassName() {
                        return commandsLayoutClass;
                    }
                },
                getWidthOfPrimaryRow: function _AppBarCommandsLayout_getWidthOfPrimaryRow(newSetOfVisibleCommands) {
                    // Commands layout puts primary commands and secondary commands into the primary row.
                    // Return the total width of all visible primary and secondary commands.


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
                _getFocusableCommandsInLogicalOrder: function _AppBarCommandsLayout_getCommandsInLogicalOrder(globalCommandHasFocus) {
                    // Function returns an array of all the contained AppBarCommands which are reachable by left/right arrows.

                    var selectionCommands = this._secondaryCommands.children,
                        globalCommands = this._primaryCommands.children,
                        focusedIndex = -1;

                    var getFocusableCommandsHelper = function (commandsInReach) {
                        var focusableCommands = [];
                        for (var i = 0, len = commandsInReach.length; i < len; i++) {
                            var element = commandsInReach[i];
                            if (WinJS.Utilities.hasClass(element, appBarCommandClass) && element.winControl) {
                                var containsFocus = element.contains(document.activeElement);
                                // With the inclusion of content type commands, it may be possible to tab to elements in AppBarCommands that are not reachable by arrow keys.
                                // Regardless, when an AppBarCommand contains the element with focus, we just include the whole command so that we can determine which
                                // commands are adjacent to it when looking for the next focus destination.
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

                    // Determines which set of commands the user could potentially reach through Home, End, and arrow keys.
                    // All commands in the commands layout AppBar, from left to right are in reach. Selection then Global.
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

    WinJS.Namespace.define("WinJS.UI", {
        _AppBarCustomLayout: WinJS.Namespace._lazy(function () {

            var customLayoutClass = "win-customlayout";

            var _AppBarCommandsLayout = WinJS.Class.define(function _AppBarCustomLayout_ctor(appBarElement) {
                this._initLayout(appBarElement);
            }, {
                // Members
                className: {
                    get: function _AppBarCommandsLayout_getClassName() {
                        return customLayoutClass;
                    }
                },
                getWidthOfPrimaryRow: function _AppBarCustomLayout_getWidthOfPrimaryRow(newSetOfVisibleCommands) {
                    //// Commands layout puts primary commands and secondary commands into the primary row.
                    //// Return the total width of all visible primary and secondary commands.


                    //if (!newSetOfVisibleCommands) {
                    //    // Return the cached width of last known visible commands in the AppBar.
                    //    return this._widthOfRelevantCommands;
                    //} else {
                    //    // Return the width of the specified commands.
                    //    var separatorsCount = 0;
                    //    var buttonsCount = 0;
                    //    var accumulatedWidth = 0;
                    //    var command;
                    //    for (var i = 0, len = newSetOfVisibleCommands.length; i < len; i++) {
                    //        command = newSetOfVisibleCommands[i].winControl || newSetOfVisibleCommands[i];
                    //        if (command._type === typeSeparator) {
                    //            separatorsCount++
                    //        } else if (command._type !== typeContent) {
                    //            // button, toggle, and flyout types all have the same width.
                    //            buttonsCount++;
                    //        } else {
                    //            accumulatedWidth += command._fullSizeWidth;
                    //        }
                    //    }
                    //}
                    return accumulatedWidth += (separatorsCount * separatorWidth) + (buttonsCount * buttonWidth);
                },
                _getFocusableCommandsInLogicalOrder: function _AppBarCustomLayout_getCommandsInLogicalOrder(globalCommandHasFocus) {
                    //// Function returns an array of all the contained AppBarCommands which are reachable by left/right arrows.

                    //var selectionCommands = this._secondaryCommands.children,
                    //    globalCommands = this._primaryCommands.children,
                    //    focusedIndex = -1;

                    //var getFocusableCommandsHelper = function (commandsInReach) {
                    //    var focusableCommands = [];
                    //    for (var i = 0, len = commandsInReach.length; i < len; i++) {
                    //        var element = commandsInReach[i];
                    //        if (WinJS.Utilities.hasClass(element, appBarCommandClass) && element.winControl) {
                    //            var containsFocus = element.contains(document.activeElement);
                    //            // With the inclusion of content type commands, it may be possible to tab to elements in AppBarCommands that are not reachable by arrow keys.
                    //            // Regardless, when an AppBarCommand contains the element with focus, we just include the whole command so that we can determine which
                    //            // commands are adjacent to it when looking for the next focus destination.
                    //            if (element.winControl._isFocusable() || containsFocus) {
                    //                focusableCommands.push(element);
                    //                if (containsFocus) {
                    //                    focusedIndex = focusableCommands.length - 1;
                    //                }
                    //            }
                    //        }
                    //    }
                    //    return focusableCommands;
                    //}

                    //// Determines which set of commands the user could potentially reach through Home, End, and arrow keys.
                    //// All commands in the commands layout AppBar, from left to right are in reach. Selection then Global.
                    //var commandsInReach = Array.prototype.slice.call(selectionCommands).concat(Array.prototype.slice.call(globalCommands));

                    //var focusableCommands = getFocusableCommandsHelper(commandsInReach);
                    //focusableCommands.focusedIndex = focusedIndex;
                    //return focusableCommands;
                },
                _initLayout: function _AppBarCustomLayout_init(appbarEl) {
                    //// Create layout infrastructure
                    //this._primaryCommands = document.createElement("DIV");
                    //this._secondaryCommands = document.createElement("DIV");
                    //WinJS.Utilities.addClass(this._primaryCommands, primaryCommandsClass);
                    //WinJS.Utilities.addClass(this._secondaryCommands, secondaryCommandsClass);
                    //if (appbarEl) {
                    //    this.connect(appbarEl);
                    //}
                },
                connect: function _AppBarCustomLayout_connect(appbarEl) {
                    //WinJS.Utilities.addClass(appbarEl, this.className);
                    //this.appbarEl = appbarEl;
                },
                layout: function _AppBarCustomLayout_layout(commands) {
                    var len = commands.length;
                    for (var i = 0; i < len; i++) {
                        var command = this._sanitizeCommand(commands[i]);
                        this.appbarEl.appendChild(command._element);
                    }
                },
                
                commands: {
                    get: function () {
                        // Gets a DOM ordered Array of the AppBarCommand elements in the AppBar. 
                        // We can't assume commands in Custom layout were set with the AppBar.commands
                        // setter.
                        commands = this.appbarEl.querySelectorAll("." + appBarCommandClass);

                        // Needs to be an array, in case these are getting passed to a new layout.
                        // The new layout will invoke the AppBar.commands setter, and it expects an 
                        // Array.
                        commands = Array.prototype.slice.call(commands);
                    }
                },
                dispose: function _AppBarCustomLayout_dispose() {
                    var appBarFirstDiv = this.appbarEl.querySelectorAll("." + firstDivClass);
                    appBarFirstDiv = appBarFirstDiv.length >= 1 ? appBarFirstDiv[0] : null;
                    var appBarFinalDiv = this.appbarEl.querySelectorAll("." + finalDivClass);
                    appBarFinalDiv = appBarFinalDiv.length >= 1 ? appBarFinalDiv[0] : null;

                    var children = this.appbarEl.children;
                    var length = children.length;
                    for (var i = 0; i < length; i++) {
                        var element = children[i];
                        if (element === appBarFirstDiv || element === appBarFinalDiv) {
                            continue;
                        } else {
                            WinJS.Utilities.disposeSubTree(element);
                        }
                    }
                },
                disconnect: function _AppBarCustomLayout_disconnect() {
                    //WinJS.Utilities.removeClass(this.appbarEl, this.className);
                    //this.appbarEl = null;
                },
                handleKeyDown: function _AppBarCustomLayout_handleKeyDown(event) {
                    // NOP
                },
                takeFocus: function _AppBarCustomLayout_takeFocus() {
                    //// Asks layout to put focus on its first command.
                    //var globalCommandHasFocus = this._primaryCommands.contains(document.activeElement);
                    //var firstCommand = this._getFocusableCommandsInLogicalOrder(globalCommandHasFocus)[0].winControl.firstElementFocus;
                    //if (firstCommand) {
                    //    firstCommand.focus();
                    //}
                },
                contentChanged: function _AppBarCustomLayout_contentChanged(newSetOfVisibleCommands) {
                    // NOP
                },
                _sanitizeCommand: function _AppBarCustomLayout_sanitizeCommand(command) {

                    if (!command) {
                        throw new WinJS.ErrorFromName("WinJS.UI.AppBar.NullCommand", strings.nullCommand);
                    }

                    // See if it's a command already
                    command = command.winControl || command;
                    if (!command._element) {
                        // Not a command, so assume it is options for the command's constructor.
                        command = new WinJS.UI.AppBarCommand(null, command);
                    }
                    // If we were attached somewhere else, detach us
                    if (command._element.parentElement) {
                        command._element.parentElement.removeChild(command._element);
                    }

                    return command;
                },
            });
            //WinJS.Class.mix(_AppBarCustomLayout, _AppBarLayoutsMixin);
            return _AppBarCustomLayout;
        }),
    });


    // These are functions and properties that a new layout would share with the existing commands layout.
    var _AppBarLayoutsMixin = {
        _initLayout: function _AppBarLayoutsMixin_init(appbarEl) {
            // Create layout infrastructure
            this._primaryCommands = document.createElement("DIV");
            this._secondaryCommands = document.createElement("DIV");
            WinJS.Utilities.addClass(this._primaryCommands, primaryCommandsClass);
            WinJS.Utilities.addClass(this._secondaryCommands, secondaryCommandsClass);
            if (appbarEl) {
                this.connect(appbarEl);
            }
        },
        connect: function _AppBarLayoutsMixin_connect(appbarEl) {
            WinJS.Utilities.addClass(appbarEl, this.className);
            this.appbarEl = appbarEl;
        },
        layout: function _AppBarLayoutsMixin_layout(commands) {
            // Insert commands and other layout specific DOM into the AppBar element.

            // Empty our tree.
            WinJS.Utilities.empty(this._primaryCommands);
            WinJS.Utilities.empty(this._secondaryCommands);

            // Keep track of the order we receive the commands in.
            this._commandsInOriginalOrder = [];

            // Layout commands
            for (var i = 0, len = commands.length; i < len; i++) {
                var command = this._sanitizeCommand(commands[i]);

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
        _sanitizeCommand: function _AppBarLayoutsMixin_sanitizeCommand(command) {

            if (!command) {
                throw new WinJS.ErrorFromName("WinJS.UI.AppBar.NullCommand", strings.nullCommand);
            }

            // See if it's a command already
            command = command.winControl || command;
            if (!command._element) {
                // Not a command, so assume it is options for the command's constructor.
                command = new WinJS.UI.AppBarCommand(null, command);
            }
            // If we were attached somewhere else, detach us
            if (command._element.parentElement) {
                command._element.parentElement.removeChild(command._element);
            }

            return command;
        },
        // Gets an Array of the AppBarCommand Elements that the layout is using.
        // Commands in the Array are in the same order that the layout first recieved them in.
        commands: {
            get: function () {
                return this._commandsInOriginalOrder.filter(function (command) {
                    // Make sure the element is still in the AppBar.
                    return this.appbarEl.contains(command);
                }, this);
            }
        },
        dispose: function _AppBarLayoutsMixin_dispose() {
            WinJS.Utilities.disposeSubTree(this._primaryCommands);
            WinJS.Utilities.disposeSubTree(this._secondaryCommands);
        },
        disconnect: function _AppBarLayoutsMixin_disconnect() {
            WinJS.Utilities.removeClass(this.appbarEl, this.className);
            this.appbarEl = null;
        },
        handleKeyDown: function _AppBarLayoutsMixin_handleKeyDown(event) {
            var Key = WinJS.Utilities.Key;

            if (WinJS.Utilities._matchesSelector(event.target, ".win-interactive, .win-interactive *")) {
                return; // Ignore left, right, home & end keys if focused element has win-interactive class.
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
                    // Prevent default so that the browser doesn't also evaluate the keydown event on the newly focused element.
                    event.preventDefault();
                }
            }
        },
        takeFocus: function _AppBarLayoutsMixin_takeFocus() {
            // Asks layout to put focus on its first command.
            var globalCommandHasFocus = this._primaryCommands.contains(document.activeElement);
            var firstCommand = this._getFocusableCommandsInLogicalOrder(globalCommandHasFocus)[0].winControl.firstElementFocus;
            if (firstCommand) {
                firstCommand.focus();
            }
        },
        contentChanged: function _AppBarLayoutsMixin_contentChanged(newSetOfVisibleCommands) {
            // Whenever new commands are set or existing commands are hidden/shown in the AppBar, this
            // function is called to update the cached width measurement of all visible AppBarCommands.
            this._widthOfRelevantCommands = 0;

            // Gather visible commands.
            var visibleCommands = (newSetOfVisibleCommands) ? newSetOfVisibleCommands : this.commands.filter(function (command) {
                return !command.winControl.hidden;
            });
            this._widthOfRelevantCommands = this.getWidthOfPrimaryRow(visibleCommands);
            return true;
        },
    }

})(WinJS);

