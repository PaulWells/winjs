// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/// <dictionary>animatable,appbar,appbars,divs,Flyout,Flyouts,iframe,Statics,unfocus,unselectable</dictionary>
(function overlayInit(WinJS) {
    "use strict";

    // Common Class Names
    var primaryCommandsClass = "win-primarygroup",
        secondaryCommandsClass = "win-secondarygroup",
        appBarCommandClass = "win-command";

    WinJS.Namespace.define("WinJS.UI", {
        _AppBarCommandsLayout: WinJS.Namespace._lazy(function () {

            var _AppBarCommandsLayout = WinJS.Class.define(function _AppBarCommandsLayout_ctor(appbarEl) {
                /// <signature helpKeyword="WinJS.UI._AppBarCommandsLayout">
                /// TODO Comment
                /// </signature>
                this.initLayout(appbarEl);
            }, {
                // Members
                className: {
                    get: function _AppBarCommandsLayout_getClassName() {
                        return "win-commandlayout";
                    }
                },
            });
            WinJS.Class.mix(_AppBarCommandsLayout, _AppBarLayoutsMixin);
            return _AppBarCommandsLayout;
        }),

        _AppBarCommandMenuLayout: WinJS.Namespace._lazy(function () {

            var _AppBarCommandMenuLayout = WinJS.Class.define(function _AppBarCommandMenuLayout_ctor(appbarEl) {
                /// <signature helpKeyword="WinJS.UI._AppBarCommandMenuLayout">       
                /// TODO coment
                /// </signature>
                this.initLayout(appbarEl);
            }, {
                // Members
                className: {
                    get: function __AppBarCommandMenuLayout_getClassName() {
                        return "win-commandmenulayout";
                    }
                },
            });
            WinJS.Class.mix(_AppBarCommandMenuLayout, _AppBarLayoutsMixin);
            return _AppBarCommandMenuLayout;
        }),

    });


    // TODO: COMMENT
    var _AppBarLayoutsMixin = {
        initLayout: function _AppBarLayouts_init(appbarEl) {
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

            WinJS.Utilities.empty(this._primaryCommands);
            WinJS.Utilities.empty(this._secondaryCommands);

            for (var i = 0, len = commands.length; i < len; i++) {
                var command = this.appbarEl.winControl._sanitizeCommand(commands[i]);
                if ("global" === command.section) {
                    this._primaryCommands.appendChild(command._element);
                } else {
                    this._secondaryCommands.appendChild(command._element);
                }
            }

            // Append layout to appbar element
            this.appbarEl.appendChild(this._primaryCommands);
            this.appbarEl.appendChild(this._secondaryCommands);
        },
        disposeChildren: function _AppBarLayouts_disposeChildren() {
            WinJS.Utilities.disposeSubTree(this._primaryCommands);
            WinJS.Utilities.disposeSubTree(this._secondaryCommands);
        },
        disconnect: function _AppBarLayouts_disconnect() {
            WinJS.Utilities.removeClass(this.appbarEl, this.className);
            this.appbarEl = null;
        },
        handleKeyDown: function _AppBarLayouts_handleKeyDown(appbarEl, event) {
            if (WinJS.Utilities._matchesSelector(event.target, ".win-interactive, .win-interactive *")) {
                return; //ignore left, right, home & end keys if focused element has win-interactive class.
            }
            var rtl = getComputedStyle(appbarEl).direction === "rtl";
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
            /* Work around until we have an offical API to check */
            var wideView = true;

            // Determine which set of commands that the user could potentially reach through Home, End, and arrow keys.
            var commandsInReach;
            if (wideView) {
                // All commands in the wide view AppBar from left to right are in reach, Selection then Global
                commandsInReach = Array.prototype.slice.call(selectionCommands).concat(Array.prototype.slice.call(globalCommands));
            } else if (globalCommandHasFocus) {
                // Drawer view and focus is in global commands container. Only Global commands are in reach.
                commandsInReach = globalCommands;
            } else {
                // Drawer view and focus is in selection commands container. Only Selection commands are in reach.
                commandsInReach = selectionCommands;
            }

            var focusableCommands = getFocusableCommandsHelper(commandsInReach);
            focusableCommands.focusedIndex = focusedIndex;
            return focusableCommands;
        },
        takeFocus: function _AppBarLayouts_takeFocus() {
            // layout should take focus and put it in its commands.
            var globalCommandHasFocus = this._primaryCommands.contains(document.activeElement);
            var firstCommand = this._getFocusableCommandsInLogicalOrder(globalCommandHasFocus)[0].winControl.firstElementFocus;
            if (firstCommand) {
                firstCommand.focus();
            }
        }
    }

})(WinJS);

