// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
define([
     'exports',
     '../../Core/_Base',
], function appBarConstantsInit(exports, _Base) {
    "use strict";

    _Base.Namespace._moduleDefine(exports, null, {
        appBarClass: "win-appbar",
        firstDivClass: "win-firstdiv",
        finalDivClass: "win-finaldiv",
        invokeButtonClass: "win-appbar-invokebutton",
        ellipsisClass: "win-appbar-ellipsis",
        primaryCommandsClass: "win-primarygroup",
        secondaryCommandsClass: "win-secondarygroup",
        reducedClass: "win-reduced",
        commandLayoutClass: "win-commandlayout",
        settingsFlyoutClass: "win-settingsflyout",
        settingsFlyoutSelector: ".win-settingsflyout",
        topClass: "win-top",
        bottomClass: "win-bottom",
        showingClass : "win-appbar-showing",
        shownClass : "win-appbar-shown",
        hidingClass : "win-appbar-hiding",
        hiddenClass : "win-appbar-hidden",

        // Constants for placement
        appBarPlacementTop: "top",
        appBarPlacementBottom: "bottom",

        // Constants for layout
        appBarLayoutCustom: "custom",
        appBarLayoutCommands: "commands",

        // Constants for Commands
        typeSeparator: "separator",
        typeContent: "content",
        typeButton: "button",
        typeToggle: "toggle",
        typeFlyout: "flyout",
        menuCommandClass: "win-command",
        appBarCommandClass: "win-command",
        appBarCommandGlobalClass: "win-global",
        appBarCommandSelectionClass: "win-selection",
        sectionSelection: "selection",
        sectionGlobal: "global",

        // Prevents the element from showing a focus rect
        hideFocusClass: "win-hidefocus",

        overlayClass: "win-overlay",
        flyoutClass: "win-flyout",
        flyoutSelector: ".win-flyout",
        flyoutLightClass: "win-ui-light",
        menuClass: "win-menu",
        menuToggleClass: "win-menu-toggle",
        scrollsClass: "win-scrolls",

        // Constants for AppBarCommands
        separatorWidth: 60,
        buttonWidth: 100,

        narrowClass: "win-narrow",
        wideClass: "win-wide",
        _clickEatingAppBarClass: "win-appbarclickeater",
        _clickEatingFlyoutClass: "win-flyoutmenuclickeater",
    });
});