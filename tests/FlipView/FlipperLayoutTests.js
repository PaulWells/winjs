// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/ui.js" />
/// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />
/// <reference path="../TestLib/LegacyLiveUnit/CommonUtils.js"/>
/// <reference path="FlipperUtils.js"/>
/// <reference path="../TestLib/ItemsManager/TestDataSource.js"/>

var LayoutTests = null;

(function() {

    // Create LayoutTests object
    LayoutTests = function() {
        var flipperUtils = new FlipperUtils();
        var commonUtils = new CommonUtils();
        var pageSelectedEvent = "pagecompleted";

        //
        // Function: SetUp
        //
        this.setUp = function() {
            LiveUnit.LoggingCore.logComment("In setup");
            commonUtils.getIEInfo();
            // We want to recreate the flipper element between each test so we start fresh.
            flipperUtils.addFlipperDom();
        }

        //
        // Function: tearDown
        //
        this.tearDown = function() {
            LiveUnit.LoggingCore.logComment("In tearDown");
            flipperUtils.removeFlipperDom();
        }

        //
        // Test: testFlipperLargeContent
        // Ensure the large content is cropped, not centered.
        //
        /*
        this.testFlipperLargeContent = function (signalTestCaseCompleted) {
            var flipperDiv = document.getElementById(flipperUtils.basicFlipperID()),
                flipperHeight = flipperDiv.offsetHeight,
                flipperWidth = flipperDiv.offsetWidth,
                foundLarge = false,
                basicIds = flipperUtils.basicFlipperHtmlIDs(),
                currentIndex = 0,
                flipper;

            LiveUnit.LoggingCore.logComment("Flipper Height: " + flipperHeight);
            LiveUnit.LoggingCore.logComment("Flipper Width: " + flipperWidth);

            var callback = LiveUnit.GetWrappedCallback(function () {
                verifyLayout(currentIndex);
                currentIndex++;
                if (currentIndex < basicIds.length) {
                    flipperUtils.ensureCurrentPage(flipper, currentIndex, callback);
                }
            });

            var verify = LiveUnit.GetWrappedCallback(function () {
                flipper.removeEventListener(pageSelectedEvent, verify);
                callback();
            });
            flipperDiv.addEventListener(pageSelectedEvent, verify);

            flipper = flipperUtils.instantiate(flipperUtils.basicFlipperID());

            var verifyLayout = function (index) {
                var pageID = basicIds[index];
                var pageDiv = document.getElementById(pageID);
                LiveUnit.Assert.isNotNull(pageDiv, "Unable to find basic html element ID: " + pageID);

                // find a page that is larger than the flipper
                if (pageDiv.offsetHeight > flipperHeight && pageDiv.offsetWidth > flipperWidth) {
                    foundLarge = true;
                    LiveUnit.LoggingCore.logComment("Found large page: " + pageID);
                    var largeHeight = pageDiv.offsetHeight;
                    var largeWidth = pageDiv.offsetWidth;
                    LiveUnit.LoggingCore.logComment("Large Height: " + largeHeight);
                    LiveUnit.LoggingCore.logComment("Large Width: " + largeWidth);

                    // Ensure that the the div is not centered (top-left justified)
                    var largeLeft = pageDiv.offsetLeft;
                    var largeTop = pageDiv.offsetTop;
                    LiveUnit.LoggingCore.logComment("Large Left: " + largeLeft);
                    LiveUnit.LoggingCore.logComment("Large Top: " + largeTop);
                    LiveUnit.Assert.isTrue(largeLeft === 0, "left style should be 0 but is " + largeLeft);
                    LiveUnit.Assert.isTrue(largeTop === 0, "top style should be 0 but is " + largeTop);

                    // Need to compare the element's dimension with panningDivContainer's dimensions
                    var parentNode = flipper._panningDivContainer;
                    var parentHeight = parentNode.offsetHeight;
                    var parentWidth = parentNode.offsetWidth;
                    LiveUnit.LoggingCore.logComment("Parent Height: " + parentHeight);
                    LiveUnit.LoggingCore.logComment("Parent Width: " + parentWidth);
                    LiveUnit.Assert.isTrue(parentHeight === flipperHeight, "Parent height of large item should " +
                        " be the same as flipper height but is not.");
                    LiveUnit.Assert.isTrue(parentWidth === flipperWidth, "Parent width of large item should be " +
                        " the same as flipper width but is not.");
                }

                if ((index + 1) === basicIds.length) {
                    // We are at the last page of flipper
                    // Ensure that a large item was found otherwise throw an assert.
                    LiveUnit.Assert.isTrue(foundLarge, "Unable to find an item larger than the flipper.  Check HTML.");
                    signalTestCaseCompleted();
                }
            };
        }
        */
        //
        // Test: testFlipperSmallContentCentered
        // Ensure that the small content is centered in the flipper region.
        //

        function pixelToInt(val){
            if(typeof val === "string"){
                return val.replace("px", "");
            }else{
                return val;
            }
        }

        this.testFlipperSmallContentCentered_horizontal = function() {
           smallContentCentered("horizontal");
        }

        this.testFlipperSmallContentCentered_vertical = function() {
           smallContentCentered("vertical");
        }

        function smallContentCentered(orientation){
            var smallRenderer = function(itemPromise) {
                var template = basicInstantRenderer(itemPromise);
                template.element.style.width = "50%";
                template.element.style.height = "50%";
                template.element.classList.add("rootElement");
                return template;
            }

            options = {itemTemplate: smallRenderer, orientation: orientation};
            var flipper = flipperUtils.instantiate(flipperUtils.basicFlipperID(), options);
            var element = flipper.element;
            var templateRoot = element.querySelector(".rootElement");

            flipViewHeight = pixelToInt(getComputedStyle(element).height);
            flipViewWidth = pixelToInt(getComputedStyle(element).width);
            itemHeight = pixelToInt(getComputedStyle(templateRoot).height);
            itemWidth = pixelToInt(getComputedStyle(templateRoot).width);
            itemTop = templateRoot.offsetTop;
            itemLeft = templateRoot.offsetLeft;

            var shorter = itemHeight < flipViewHeight;
            var thinner =  itemWidth < flipViewWidth;

            LiveUnit.Assert.isTrue(shorter && thinner, "content should be smaller than the FlipView");

            var centerTop = Math.ceil((flipViewHeight - itemHeight) / 2);
            var centerLeft = Math.ceil((flipViewWidth - itemWidth) / 2);

            LiveUnit.Assert.isTrue(centerTop === itemTop, "content is not vertically centered");
            LiveUnit.Assert.isTrue(centerLeft === itemLeft, "content is not horizontally centered");
        }
    }

    // Register the object as a test class by passing in the name
    LiveUnit.registerTestClass("LayoutTests");
} ());
