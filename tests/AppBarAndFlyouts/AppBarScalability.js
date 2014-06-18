// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/base.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/ui.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/ui.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />

var CorsicaTests = CorsicaTests || {};

CorsicaTests.AppBarScalabilityTests = function () {
    "use strict";

    // If the AppBar has the ellipsis (ie closedDisplayMode !== 'none', then the AppBar also has reserved some right padding 
    // to keep other contents in the flow of the AppBar DOM from overlaying it. 
    var rightPaddingReservedForEllipsis = 40;

    this.setUp = function () {
        LiveUnit.LoggingCore.logComment("In setUp");
        var host = document.createElement("div");
        host.id = "host";
        host.style.width = "650px";
        host.style.height = "400px";
        host.style.margin = "40px";
        host.style.position = "relative";
        host.style.border = "2px solid silver";
        host.innerHTML = "<div id='topappbar' style='background-color:green;position:absolute;'></div>" +
            "<div id='bottomappbar' style='background-color:blue;position:absolute;'></div>";
        document.body.appendChild(host);

        //// Overwrite _scaleHelper so that we can mock test the scaling commands on window resize.
        //originalHelper = WinJS.UI._AppBarCommandsLayout.prototype._scaleHelper;
        //WinJS.UI._AppBarCommandsLayout.prototype._scaleHelper = testHelper;
    };

    this.tearDown = function () {
        LiveUnit.LoggingCore.logComment("In tearDown");
        var element = document.getElementById("host");
        if (element) {
            WinJS.Utilities.disposeSubTree(element);
            document.body.removeChild(element);
            element = null;
        }

        //// Restore original implementation.
        //WinJS.UI._AppBarCommandsLayout.prototype._scaleHelper = originalHelper;
    };

    var that = this,
        fullSizeCommandWidth = 100,
        reducedSizeCommandWidth = 60,
        fullSizeSeparatorWidth = 60,
        reducedSizeSeparatorWidth = 20,
        originalHelper,
        reducedAppBarClass = "win-reduced";

    //function testHelper() {
    //    var prevDisplay = this.appBarEl.style.display;
    //    this.appBarEl.style.display = "";
    //    var returnValue = getComputedStyle(this.appBarEl).width;
    //    this.appBarEl.style.display = prevDisplay;
    //    return returnValue;
    //}

    function createAppBarCommands(cmdButtonCount, separatorCount) {
        var cmds = [],
            cmd,
            string;

        cmdButtonCount = cmdButtonCount === +cmdButtonCount ? cmdButtonCount : 1;
        separatorCount = separatorCount === +separatorCount ? separatorCount : 0;
        for (var i = 0; i < cmdButtonCount; i++) {
            string = "Button " + i;
            cmd = new WinJS.UI.AppBarCommand(null, { id: string, icon: "add", label: string, type: "button" });
            // Assign a quasi-random section
            cmd.section = (cmdButtonCount + separatorCount) * i % 2 === 0 ? "global" : "selection";
            cmds.push(cmd);
        }
        for (var j = 0; j < separatorCount; j++) {
            string = "Separator " + j;
            cmd = new WinJS.UI.AppBarCommand(null, { id: string, type: "separator" });
            // Assign a quasi-random section
            cmd.section = (cmdButtonCount + separatorCount) * j % 2 === 0 ? "global" : "selection";
            cmds.push(cmd);
        }
        return cmds;
    }

    function isReducedSizeExpected(host, appBarElem, cmdCount, sepCount, widthOfAllContentCommands) {
        var ctrlWidth = parseInt(getComputedStyle(appBarElem).width, 10);

        LiveUnit.LoggingCore.logComment("Control width: " + ctrlWidth);
        LiveUnit.LoggingCore.logComment("AppBar command button count: " + cmdCount);
        LiveUnit.LoggingCore.logComment("AppBar command separator count: " + sepCount);
        var totalFullSizeCmdWidth = (cmdCount * fullSizeCommandWidth) + (sepCount * fullSizeSeparatorWidth + widthOfAllContentCommands);
        return totalFullSizeCmdWidth > ctrlWidth ? true : false;
    }

    function setWidth(element, width) {
        element.style.width = width + "px";
    }

    function verifyCommandSizes(host, appBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, widthOfAllContentCommands) {
        var expectingReducedSize = isReducedSizeExpected(host, appBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, widthOfAllContentCommands);

        verifyReducedClass(expectingReducedSize, appBarElem);

        LiveUnit.LoggingCore.logComment("Verifying Command Sizes");
        // We have a hard coded expectaion about button and separator command sizes. Verify them now.
        verifyButtonCommandSizes(expectingReducedSize, appBarElem);
        verifySeparatorCommandSizes(expectingReducedSize, appBarElem);
    }

    function verifyReducedClass(expectingReducedSize, appBarElem) {
        LiveUnit.LoggingCore.logComment("Expecting Reduced-sized commands? " + expectingReducedSize);
        LiveUnit.Assert.areEqual(WinJS.Utilities.hasClass(appBarElem, reducedAppBarClass), expectingReducedSize),
        "AppBar hasClass \"" + reducedAppBarClass + "\":" + expectingReducedSize + ", but we were expecting " + !expectingReducedSize;
    }

    function verifyButtonCommandSizes(expectingReducedSize, appBarElem) {
        var buttons = appBarElem.querySelectorAll("button.win-command"),
            buttonsLength = buttons.length,
            labelElement,
            displayNone;

        // Make sure we can measure.
        if (appBarElem.style.display === "none") {
            displayNone = true;
            appBarElem.style.display = "";
        }
        if (expectingReducedSize) { // Reduced-size commands.
            for (var i = 0; i < buttonsLength; i++) {
                if (!buttons[i].winControl.hidden) {
                    LiveUnit.Assert.areEqual(buttons[i].offsetWidth, reducedSizeCommandWidth, "Command Buttons are too big");
                    labelElement = buttons[i].querySelector(".win-label");
                    LiveUnit.Assert.areEqual(getComputedStyle(labelElement).display, "none", "Command Button labels should be hidden");
                }
            }
        } else { // Full-size commands.
            for (var i = 0; i < buttonsLength; i++) {
                if (!buttons[i].winControl.hidden) {
                    LiveUnit.Assert.areEqual(buttons[i].offsetWidth, fullSizeCommandWidth, "Command Buttons are too small");
                    labelElement = buttons[i].querySelector(".win-label");
                    LiveUnit.Assert.areEqual(labelElement.style.display, "", "Command Button labels should be visible when commands are full size.");
                }
            }
        }
        if (displayNone) {
            // Restore display.
            appBarElem.style.display = "none";
        }
    }

    function verifySeparatorCommandSizes(expectingReducedSize, appBarElem) {
        var separators = appBarElem.querySelectorAll("hr.win-command"),
            separatorsLength = separators.length,
            style,
            measurement;
        if (expectingReducedSize) { // Reduced-size commands.
            for (var i = 0; i < separatorsLength; i++) {
                if (!separators[i].winControl.hidden) {
                    style = getComputedStyle(separators[i]); // For separators we have to measure their width + margins.
                    measurement = parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10) + parseInt(style.width, 10);
                    LiveUnit.Assert.areEqual(measurement, reducedSizeSeparatorWidth, "Command Separators are too big");
                }
            }
        } else { // Full-size commands.
            for (var i = 0; i < separatorsLength; i++) {
                if (!separators[i].winControl.hidden) {
                    style = getComputedStyle(separators[i]); // For separators we have to measure their width + margins.
                    measurement = parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10) + parseInt(style.width, 10);
                    LiveUnit.Assert.areEqual(measurement, fullSizeSeparatorWidth, "Command Separators are too small");
                }
            }
        }

    }

    this.testAppBarPadding = function (complete) {
        var topAppBarElem = document.getElementById("topappbar");
       
        var topAppBar = new WinJS.UI.AppBar(topAppBarElem, { sticky: true, placement: 'top'});
        LiveUnit.LoggingCore.logComment("Top AppBar Initialized with commands");
          
        topAppBar.show();        
        
        LiveUnit.LoggingCore.logComment("Verify padding for full-size AppBar with Ellipsis");
        topAppBar.closedDisplayMode = 'minimal';
        WinJS.Utilities.removeClass(topAppBarElem, reducedAppBarClass);
        var expectedLeftPadding = 0;
        var expectedRightPadding = rightPaddingReservedForEllipsis;
        var appBarStyle = getComputedStyle(topAppBarElem);
        LiveUnit.Assert.areEqual(expectedLeftPadding, parseInt(appBarStyle.paddingLeft, 10), "Incorrect left padding for full-size AppBar with Ellipsis");
        LiveUnit.Assert.areEqual(expectedRightPadding, parseInt(appBarStyle.paddingRight, 10), "Incorrect right padding for full-size AppBar with Ellipsis");

        LiveUnit.LoggingCore.logComment("Verify padding for full-size AppBar with no Ellipsis");      
        topAppBar.closedDisplayMode = "none";
        WinJS.Utilities.removeClass(topAppBarElem, reducedAppBarClass);
        expectedLeftPadding = 0;
        expectedRightPadding = 0;
        appBarStyle = getComputedStyle(topAppBarElem);
        LiveUnit.Assert.areEqual(expectedLeftPadding, parseInt(appBarStyle.paddingLeft, 10), "Incorrect left padding for full-size AppBar with no Ellipsis");
        LiveUnit.Assert.areEqual(expectedRightPadding, parseInt(appBarStyle.paddingRight, 10), "Incorrect right padding for full-size AppBar with no Ellipsis");        

        LiveUnit.LoggingCore.logComment("Verify padding for win-reduced AppBar with Ellipsis");
        topAppBar.closedDisplayMode = 'minimal';
        WinJS.Utilities.addClass(topAppBarElem, reducedAppBarClass);
        expectedLeftPadding = 10;
        expectedRightPadding = rightPaddingReservedForEllipsis;
        appBarStyle = getComputedStyle(topAppBarElem);
        LiveUnit.Assert.areEqual(expectedLeftPadding, parseInt(appBarStyle.paddingLeft, 10), "Incorrect left padding for win-reduced AppBar with Ellipsis");
        LiveUnit.Assert.areEqual(expectedRightPadding, parseInt(appBarStyle.paddingRight, 10), "Incorrect right padding for win-reduced AppBar with Ellipsis");

        LiveUnit.LoggingCore.logComment("Verify padding for win-reduced AppBar with no Ellipsis");
        topAppBar.closedDisplayMode = "none";
        WinJS.Utilities.addClass(topAppBarElem, reducedAppBarClass);
        expectedLeftPadding = 10;
        expectedRightPadding = 10;
        appBarStyle = getComputedStyle(topAppBarElem);
        LiveUnit.Assert.areEqual(expectedLeftPadding, parseInt(appBarStyle.paddingLeft, 10), "Incorrect left padding for win-reduced AppBar with no Ellipsis");
        LiveUnit.Assert.areEqual(expectedRightPadding, parseInt(appBarStyle.paddingRight, 10), "Incorrect right padding for win-reduced AppBar with no Ellipsis");      

        complete();
    };

    this.testCommandSizeAtAppBarInitAndResize = function (complete) {
        var topAppBarElem = document.getElementById("topappbar"),
            bottomAppBarElem = document.getElementById("bottomappbar"),
            host = document.getElementById("host"),
            appBarVisibleCommandCount = 6,
            appBarVisibleSeparatorCount = 1;

        // Create AppBarCommands via JavaScript for the topAppBar and then pass them to the constructor of the TopAppBar.
        var commands = createAppBarCommands(appBarVisibleCommandCount, appBarVisibleSeparatorCount);
        // Add 2 hidden commands to verify that these are not included when we calculate how wide the commands are.
        commands = commands.concat([
            new WinJS.UI.AppBarCommand(null, { label: "hiddenButton", hidden: true }),
            new WinJS.UI.AppBarCommand(null, { hidden: true, type: "separator" })
        ]);
        // Add a content command
        var contentDiv = document.createElement("DIV");
        contentDiv.innerHTML = "<div style=\"height:50px; width:50px; background-color:yellow;\"></div>";
        contentDiv.style.padding = "0px";
        contentDiv.style.margin = "0px";
        contentDiv.style.border = "none";
        commands = commands.concat([
            new WinJS.UI.AppBarCommand(contentDiv, { id: "contentDiv", type: 'content' }),
        ]);

        LiveUnit.LoggingCore.logComment("Top AppBarCommands created");
        var topAppBar = new WinJS.UI.AppBar(topAppBarElem, { sticky: true, placement: 'top', commands: commands, closedDisplayMode: 'none' });
        LiveUnit.LoggingCore.logComment("Top AppBar Initialized with commands");
        topAppBar.show();

        // Create AppBarCommands as innerHTML of the BottomAppBarElement and then call the AppBar constructor. Include 2 extra hidden buttons and one visible content command.
        bottomAppBarElem.innerHTML = "<button data-win-control='WinJS.UI.AppBarCommand' data-win-options='{label:\"Button 0\", type:\"button\", section:\"global\"}'></button>" +
            "<button data-win-control='WinJS.UI.AppBarCommand' data-win-options='{label:\"Button 1\", type:\"button\", section:\"global\"}'></button>" +
            "<button data-win-control='WinJS.UI.AppBarCommand' data-win-options='{label:\"Button 2\", type:\"button\", section:\"selection\"}'></button>" +
            "<button data-win-control='WinJS.UI.AppBarCommand' data-win-options='{label:\"Button 3\", type:\"button\", section:\"global\"}'></button>" +
            "<button data-win-control='WinJS.UI.AppBarCommand' data-win-options='{label:\"Button 4\", type:\"button\", section:\"selection\"}'></button>" +
            "<button data-win-control='WinJS.UI.AppBarCommand' data-win-options='{label:\"Button 5\", type:\"button\", section:\"selection\"}'></button>" +
            "<button data-win-control='WinJS.UI.AppBarCommand' data-win-options='{label:\"Button 6\", type:\"button\", section:\"global\", hidden: true}'></button>" +
            "<hr data-win-control='WinJS.UI.AppBarCommand' data-win-options='{type:\"separator\", hidden: true, section:\"global\"}' />" +
            "<hr data-win-control='WinJS.UI.AppBarCommand' data-win-options='{type:\"separator\", section:\"selection\"}' />" +
            "<div style=\"border:none; padding:0px; margin:0px;\" data-win-control='WinJS.UI.AppBarCommand' data-win-options='{type:\"content\", section:\"selection\"}'> <div style=\"height:50px;width:50px; background-color:yellow;\"></div> </div>";
        var bottomAppBar = new WinJS.UI.AppBar(bottomAppBarElem, { sticky: true, closedDisplayMode: 'minimal' });
        LiveUnit.LoggingCore.logComment("Bottom AppBar Initialized with commands");
        bottomAppBar.show();

        // Verify the command sizes when they don't all fit at full size.
        LiveUnit.LoggingCore.logComment("Verify sizes after init");
        verifyCommandSizes(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, WinJS.Utilities.getTotalWidth(contentDiv));
        verifyCommandSizes(host, bottomAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, WinJS.Utilities.getTotalWidth(bottomAppBarElem.querySelector("div.win-command")));

        // Increase the container width to in crease the AppBars width's in turn. Allowwng full size commands to fit on a single row.
        LiveUnit.LoggingCore.logComment("Increasing AppBarContainer size");
        setWidth(host, 750);

        // Workaround since we can't trigger a window resize from javascript directly.
        // Let the AppBar layout know that a resize occurred.
        topAppBar._layout.resize();
        bottomAppBar._layout.resize();

        // Yield and verify sizes
        WinJS.Promise.timeout(100).
            then(function () {                
                verifyCommandSizes(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, WinJS.Utilities.getTotalWidth(contentDiv));
                verifyCommandSizes(host, bottomAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, WinJS.Utilities.getTotalWidth(bottomAppBarElem.querySelector("div.win-command")));
                return WinJS.Promise.timeout(100);
            }).then(function () {
                verifyCommandSizes(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, WinJS.Utilities.getTotalWidth(contentDiv));
                verifyCommandSizes(host, bottomAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, WinJS.Utilities.getTotalWidth(bottomAppBarElem.querySelector("div.win-command")));                
            }).
            done(complete);
    };

    this.testHideShowAndShowOnlyCommandsWhileClosed = function (complete) {
        // This test verifies that any changes to commands while the AppBar is closed get 
        // reflected by AppBar Scalability just before the next time the AppBar is opened.

        function getRandomCommands(cmdArr) {
            var arr = [],
                visibleCmdCount = 0,
                visibleSepCount = 0,
                visibleContentWidth = 0,
                cmdArrLen = cmdArr.length,
                cmd,
                arrLen = 0;

            while (arrLen === 0) {
                arrLen = Math.floor(Math.random() * cmdArrLen);
            }
            for (var i = 0; i < arrLen; i++) {
                cmd = cmdArr[i];
                if (cmd.type === "separator") {
                    visibleSepCount++;
                } else if (cmd.type !== "content") {
                    visibleCmdCount++;
                } else {
                    visibleContentWidth += WinJS.Utilities.getTotalWidth(cmd);
                }
                arr.push(cmdArr[i]);
            }
            return {
                arr: arr,
                visibleCmdCount: visibleCmdCount,
                visibleSepCount: visibleSepCount,
                visibleContentWidth: visibleContentWidth,
            };
        }

        function testHideCommandsAfterHide() {
            topAppBar.removeEventListener("afterhide", testHideCommandsAfterHide, false);
            nextTestIndex++;
            var cmd;
            LiveUnit.LoggingCore.logComment("AppBar.hideCommands to make room for other commands to grow to full size.");
            for (var i = 0; i < commands.length; i++) {
                cmd = commands[i];
                if (!cmd.hidden) {
                    if (cmd.type === "separator") {
                        appBarVisibleSeparatorCount--;
                    } else if (cmd.type !== "content") {
                        appBarVisibleCommandCount--;
                    } else {
                        appBarVisibleContentWidth -= contentDivWidth;
                    }
                    topAppBar.hideCommands([cmd]);
                    var expectingReducedClass = isReducedSizeExpected(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);
                    verifyReducedClass(expectingReducedClass, topAppBarElem);

                }
            };
            topAppBar.show();
        }

        function testShowCommandsAfterHide() {
            topAppBar.removeEventListener("afterhide", testShowCommandsAfterHide, false);
            nextTestIndex++;
            var cmd;
            LiveUnit.LoggingCore.logComment("AppBar.showCommands to force commands to shrink down");
            for (var i = 0; i < commands.length; i++) {
                cmd = commands[i];
                topAppBar.showCommands([cmd]);
                if (cmd.type === "separator") {
                    appBarVisibleSeparatorCount++;
                } else if (cmd.type !== "content") {
                    appBarVisibleCommandCount++;
                } else {
                    appBarVisibleContentWidth += contentDivWidth;
                }
                var expectingReducedClass = isReducedSizeExpected(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);
                verifyReducedClass(expectingReducedClass, topAppBarElem);
            }
            topAppBar.show();
        }

        function testShowOnlyCommandsAfterHide() {
            topAppBar.removeEventListener("afterhide", testShowOnlyCommandsAfterHide, false);
            nextTestIndex++;
            var cmd;
            LiveUnit.LoggingCore.logComment("AppBar.showOnlyCommands to make it full size");
            var iterations = 25;
            var foo;
            for (var i = 0; i < iterations; i++) {
                foo = getRandomCommands(commands);
                topAppBar.showOnlyCommands(foo.arr);

                appBarVisibleCommandCount = foo.visibleCmdCount;
                appBarVisibleSeparatorCount = foo.visibleSepCount;
                appBarVisibleContentWidth = foo.visibleContentWidth;

                var expectingReducedClass = isReducedSizeExpected(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);
                verifyReducedClass(expectingReducedClass, topAppBarElem);
            }
            topAppBar.show();
        }

        function testComplete() {
            topAppBar.removeEventListener("beforeshow", verifyCommandSizesAtShowTime, false);
            topAppBar.removeEventListener("afterhide", testComplete, false);
            complete();
        }

        function verifyCommandSizesAtShowTime() {
            verifyCommandSizes(host, topAppBar.element, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);
            // Verify that AppBar scalability tracks calls to the showCommands, hideCommands, 
            // and showOnlyCommands api's while closed, and sizes the buttons correctly.
            topAppBar.addEventListener("afterhide", testOrder[nextTestIndex], false);
            topAppBar.hide();
        }

        // our 'beforeshow' event listener will use these to set the correct 'afterhide' listener.
        var nextTestIndex = 0;
        var testOrder = [
            testHideCommandsAfterHide,
            testShowCommandsAfterHide,
            testShowOnlyCommandsAfterHide,
            testComplete,
        ]

        var topAppBarElem = document.getElementById("topappbar"),
            host = document.getElementById("host"),
            appBarVisibleCommandCount = 6,
            appBarVisibleSeparatorCount = 1,
            appBarVisibleContentWidth = 0;

        // Create AppBarCommands via JavaScript for the topAppBar and then pass them to the constructor of the TopAppBar.
        var commands = createAppBarCommands(appBarVisibleCommandCount, appBarVisibleSeparatorCount);
        // Add 2 hidden commands to verify that these are not included when we calculate how wide the commands are.
        commands = commands.concat([
            new WinJS.UI.AppBarCommand(null, { label: "hiddenButton", hidden: true }),
            new WinJS.UI.AppBarCommand(null, { hidden: true, type: "separator" })
        ]);
        // Add a content command
        var contentDiv = document.createElement("DIV");
        contentDiv.innerHTML = "<div style=\"height:50px; width:50px; background-color:yellow;\"></div>";
        contentDiv.style.padding = "0px";
        contentDiv.style.margin = "0px";
        contentDiv.style.border = "none";
        commands = commands.concat([
            new WinJS.UI.AppBarCommand(contentDiv, { id: "contentDiv", type: 'content' }),
        ]);

        // Element needs to be in the DOM before we can measure.
        document.body.appendChild(contentDiv);
        var contentDivWidth = WinJS.Utilities.getTotalWidth(contentDiv);
        appBarVisibleContentWidth += contentDivWidth;

        LiveUnit.LoggingCore.logComment("Top AppBarCommands created");
        var topAppBar = new WinJS.UI.AppBar(topAppBarElem, { sticky: true, placement: 'top', commands: commands, closedDisplayMode: 'minimal' });
        LiveUnit.LoggingCore.logComment("Top AppBar Initialized with commands");


        // Set up event listener to check for correct command sizes when the AppBar is opening.
        topAppBar.addEventListener("beforeshow", verifyCommandSizesAtShowTime, false);

        // Need to force the AppBar to measure the contentCommand we added. The AppBar does this lazily upon construction or whenever it is opened. 
        // Open the AppBar to run our 'beforeshow' handler and verify that the commands set in the constructor are scaled correctly.
        topAppBar.show();


    };

    this.testAppBarCommandsHiddenProperty = function (complete) {

        function testSettingHiddenTrue() {
            topAppBar.removeEventListener("afterhide", testSettingHiddenTrue, false);
            nextTestIndex++;
            var cmd;
            LiveUnit.LoggingCore.logComment("AppBarCommand.hidden to make room for other commands to grow to full size.");
            // Hide appbarcommands
            for (var i = 0; i < commands.length; i++) {
                cmd = commands[i];
                if (!cmd.hidden) {
                    if (cmd.type === "separator") {
                        appBarVisibleSeparatorCount--;
                    } else if (cmd.type !== "content") {
                        appBarVisibleCommandCount--;
                    } else {
                        appBarVisibleContentWidth -= contentDivWidth;
                    }
                    cmd.hidden = true;
                    var expectingReducedClass = isReducedSizeExpected(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);
                    verifyReducedClass(expectingReducedClass, topAppBarElem);
                }
            }
            topAppBar.show();
        }

        function testSettingHiddenFalse() {
            topAppBar.removeEventListener("afterhide", testSettingHiddenFalse, false);
            nextTestIndex++;
            var cmd;
            // Show appbarcommands
            for (var i = 0; i < commands.length; i++) {
                cmd = commands[i];
                if (cmd.type === "separator") {
                    appBarVisibleSeparatorCount++;
                } else if (cmd.type !== "content") {
                    appBarVisibleCommandCount++;
                } else {
                    appBarVisibleContentWidth += contentDivWidth;
                }
                cmd.hidden = false;
                var expectingReducedClass = isReducedSizeExpected(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);
                verifyReducedClass(expectingReducedClass, topAppBarElem);
            }
            topAppBar.show();
        }

        function testComplete() {
            topAppBar.removeEventListener("beforeshow", verifyCommandSizesAtShowTime, false);
            topAppBar.removeEventListener("afterhide", testComplete, false); 
            complete();
        }

        var verifyCommandSizesAtShowTime = function verifyCommandSizesAtShowTime() {
            verifyCommandSizes(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);

            topAppBar.addEventListener("afterhide", testOrder[nextTestIndex], false);
            topAppBar.hide();
        }

        // our 'beforeshow' event listener will use these to set the correct 'afterhide' listener.
        var nextTestIndex = 0;
        var testOrder = [
            testSettingHiddenTrue,
            testSettingHiddenFalse,
            testComplete,
        ]

        var topAppBarElem = document.getElementById("topappbar"),
            host = document.getElementById("host"),
            appBarVisibleCommandCount = 6,
            appBarVisibleSeparatorCount = 1,
            appBarVisibleContentWidth = 0;

        // Create AppBarCommands via JavaScript for the topAppBar and then pass them to the constructor of the TopAppBar.
        var commands = createAppBarCommands(appBarVisibleCommandCount, appBarVisibleSeparatorCount);
        // Add 2 hidden buttons to verify that these are not included when we calculate how wide the commands are.
        commands = commands.concat([
            new WinJS.UI.AppBarCommand(null, { id: "hiddenButton", label: "hiddenButton", hidden: true }),
            new WinJS.UI.AppBarCommand(null, { id: "hiddenSeparator", hidden: true, type: "separator" })
        ]);
        // Add a content command
        var contentDiv = document.createElement("DIV");
        contentDiv.innerHTML = "<div style=\"height:50px; width:50px; background-color:yellow;\"></div>";
        contentDiv.style.padding = "0px";
        contentDiv.style.margin = "0px";
        contentDiv.style.border = "none";
        commands = commands.concat([
            new WinJS.UI.AppBarCommand(contentDiv, { id: "contentDiv", type: 'content' }),
        ]);

        // Element needs to be in the DOM before we can measure.
        document.body.appendChild(contentDiv);
        var contentDivWidth = WinJS.Utilities.getTotalWidth(contentDiv);
        appBarVisibleContentWidth += contentDivWidth;

        LiveUnit.LoggingCore.logComment("Top AppBarCommands created");
        var topAppBar = new WinJS.UI.AppBar(topAppBarElem, { sticky: true, placement: 'top', commands: commands, closedDisplayMode: 'minimal' });
        LiveUnit.LoggingCore.logComment("Top AppBar Initialized with commands");

        // Set up event listener to check for correct command sizes when the AppBar is opening.
        topAppBar.addEventListener("beforeshow", verifyCommandSizesAtShowTime, false);

        // Need to force the AppBar to measure the contentCommand we added. The AppBar does this lazily upon construction or whenever it is opened. 
        // Open the AppBar to run our 'beforeshow' handler and verify that the commands set in the constructor are scaled correctly.
        topAppBar.show();
    };

    this.testAppBarScalabilityWhileAppBarIsVisible = function (complete) {
        var topAppBarElem = document.getElementById("topappbar"),
            host = document.getElementById("host"),
            appBarVisibleCommandCount = 6,
            appBarVisibleSeparatorCount = 1,
            appBarVisibleContentWidth = 0;

        // Create AppBarCommands via JavaScript for the topAppBar and then pass them to the constructor of the TopAppBar.
        var commands = createAppBarCommands(appBarVisibleCommandCount, appBarVisibleSeparatorCount);
        // Add 2 hidden commands to verify that these are not included when we calculate how wide the commands are.
        commands = commands.concat([
            new WinJS.UI.AppBarCommand(null, { id: "hiddenButton", label: "hiddenButton", hidden: true }),
            new WinJS.UI.AppBarCommand(null, { id: "hiddenSeparator", hidden: true, type: "separator" })
        ]);
        // Add a content command
        var contentDiv = document.createElement("DIV");
        contentDiv.innerHTML = "<div style=\"height:50px; width:50px; background-color:yellow;\"></div>";
        contentDiv.style.padding = "0px";
        contentDiv.style.margin = "0px";
        contentDiv.style.border = "none";
        commands = commands.concat([
            new WinJS.UI.AppBarCommand(contentDiv, { id: "contentDiv", type: 'content' }),
        ]);

        // Element needs to be in the DOM before we can measure.
        document.body.appendChild(contentDiv);
        var contentDivWidth = WinJS.Utilities.getTotalWidth(contentDiv);
        appBarVisibleContentWidth += contentDivWidth;

        LiveUnit.LoggingCore.logComment("Top AppBarCommands created");
        var topAppBar = new WinJS.UI.AppBar(topAppBarElem, { sticky: true, placement: 'top', commands: commands, closedDisplayMode: 'minimal' });
        LiveUnit.LoggingCore.logComment("Top AppBar Initialized with commands");
        topAppBar.show();

        LiveUnit.LoggingCore.logComment("Hiding Button1 to make room for the other commands to grow full size.");
        topAppBar.hideCommands([commands[1]]);
        LiveUnit.LoggingCore.logComment("Verify that AppBar.hideCommands() on visible AppBar doesn't happen syncronously, but rather waits for command hiding animations to complete.");
        verifyCommandSizes(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);

        // Appbar doesn't fire any events when labels are added or dropped.
        // We are waiting on more than just the command hiding animation, 
        // the AppBar schedules a job to start the animation so we have to leave enough time for that as well.
        // Hence the timeout of 2000ms. 
        var delay = Math.min(WinJS.UI._animationTimeAdjustment(2000) * 5, 2000);
        WinJS.Promise.timeout(delay).then(function () {
            appBarVisibleCommandCount--;
            // If this Check is found to fail intermittenly on certain devices, it may be that we have to increase the timing delay or add a better hook to test for.
            verifyCommandSizes(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);

            LiveUnit.LoggingCore.logComment("Showing Button1 to force commands to scale down.");
            topAppBar.showCommands([commands[1]]);
            LiveUnit.LoggingCore.logComment("Verify that AppBar.showCommands() on visible AppBar doesnt happen syncronously.");
            verifyCommandSizes(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);
            return WinJS.Promise.timeout(delay);
        }).then(function () {
            appBarVisibleCommandCount++;
            verifyCommandSizes(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);

            // Simultaneously hide Button0 while showing every other command button and command separator, resulting 
            // in an overall Net gain in AppBar visible content width. verify that the commands scale correctly.        
            LiveUnit.LoggingCore.logComment("Verify that when a call to AppBar.showOnlyCommands() on a visible AppBar results in a net decrease of content width, the command size changes do not happen synchronously");
            topAppBar.showOnlyCommands([commands[3], commands[4], commands[5], commands[6], commands[7], commands[8], commands[9]]);
            return WinJS.Promise.timeout(delay);
        }).then(function () {
            appBarVisibleCommandCount = 4;
            appBarVisibleSeparatorCount = 2;
            verifyCommandSizes(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);
            LiveUnit.LoggingCore.logComment("Verify that visible AppBar waited until after the animations finished before scaling its content");
            LiveUnit.Assert.areEqual(topAppBar._layout._scaleAfterAnimations, true, "AppBar should scale commands after hiding animations");

            LiveUnit.LoggingCore.logComment("Verify that when a call to AppBar.showOnlyCommands() on a visible AppBar results in a net increase of content width, the command size changes do happen synchronously");
            topAppBar.showOnlyCommands([commands[0], commands[1], commands[2], commands[3], commands[4], commands[5], commands[9]]);
            return WinJS.Promise.timeout(delay);
        }).then(function () {
            appBarVisibleCommandCount = 6;
            appBarVisibleSeparatorCount = 0;
            verifyCommandSizes(host, topAppBarElem, appBarVisibleCommandCount, appBarVisibleSeparatorCount, appBarVisibleContentWidth);
            LiveUnit.LoggingCore.logComment("Verify that visible AppBar did not wait until after the animations to scale its content");
            LiveUnit.Assert.areEqual(topAppBar._layout._scaleAfterAnimations, false, "AppBar should scale commands before staring animations");
            complete();
        });
    };
};

// register the object as a test class by passing in the name
LiveUnit.registerTestClass("CorsicaTests.AppBarScalabilityTests");
