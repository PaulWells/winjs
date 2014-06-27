// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/base.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/ui.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/ui.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />
/// <reference path="../TestLib/LegacyLiveUnit/CommonUtils.js"/>
/// <reference path="../TestLib/NavBar/NavBarUtils.js"/>
/// <reference path="../TestLib/util.js"/>
/// <reference path="../TestData/NavBar.css" />

var WinJSTests = WinJSTests || {};

WinJSTests.NavBarContainerTests = function () {
    "use strict";

    var navUtils = NavBarUtils;

    this.testDocumentHasFocus = function () {
        LiveUnit.Assert.isTrue(document.hasFocus(), "The document should have focus");
    };
};

LiveUnit.registerTestClass("WinJSTests.NavBarContainerTests");
