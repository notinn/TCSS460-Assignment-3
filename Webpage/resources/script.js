
$(document).ready(function(){

    // Route 1: Cat names

    function buildCatName(catname) {
        console.log(catname);
        var nameParent = $('<div class="p-2"></div>');
        var nameDisplay = $('<div class="p-2 border rounded-3 bg-light"></div>');

        nameDisplay.append('<div>' + catname.name + "</div>");
        
        nameParent.append(nameDisplay);
        $("#cnResultDiv").append(nameParent);
    }

    $("#catNamesSubmit").click(async function getcatNames() {
        var amount = $("#catNamesAmount").val();

        const cnUrl = "http://localhost:3000/catnames";
        const cnResponse = await fetch (cnUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
        });

        // Convert response to JSON
        const cnData = await cnResponse.json();

        console.log(cnData);

        // Remove any existing results
        $("#cnResultDiv").empty();

        // Display the returned name
        for (var i = 0; i < cnData.catnames.length; i++) {
            buildCatName(cnData.catnames[i]);
        }
        
    })

    // Route 2: Cat Weights

    function buildCatWeight(catweight) {
        console.log(catweight);
        var weightParent = $('<div class="p-2"></div>');
        var weightDisplay = $('<div class="p-2 border rounded-3 bg-light"></div>');

        weightDisplay.append('<div>Name: ' + catweight.name + "</div>");
        weightDisplay.append('<div>Weight: ' + catweight.weight + " lbs</div>");
        
        weightParent.append(weightDisplay);
        $("#cwResultDiv").append(weightParent);
    }

    $(catWeightsSubmit).click(async function getCatNames() {
        var name = $("#catWeightsName").val();
        var weight = $("#catWeightsWeight").val();

        var resultParent = $('<div class="p-2"></div>');
        var resultDisplay = $('<div class="p-2 border rounded-3 bg-light"></div>');

        var cwUrl = "http://localhost:3000/catweights"
        if (weight == "") {
            // Only viewing weight(s), get request
            if (name != "") {
                // Search for a specific cat
                cwUrl += "/" + name
            }
            const cwResponse = await fetch (cwUrl, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
            });

            // Convert response to json
            const cwData = await cwResponse.json();

            console.log(cwData);

            // Remove any existing results
            $("#cwResultDiv").empty();

            // Add results of get request
            if (typeof cwData.message !== 'undefined') {
                $("#cwResultDiv").append();
                resultDisplay.append('<div>' + cwData.message + '</div>');
                resultParent.append(resultDisplay);
                $("#cwResultDiv").append(resultParent);
            } else {
                for (var i = 0; i < cwData.catweights.length; i++) {
                    buildCatWeight(cwData.catweights[i]);
                }
            }
        } else {
            // Updating weight, post request
            
            cwUrl += "/" + name + "/" + weight;

            const cwResponse = await fetch (cwUrl, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
            });

            // Convert response to json
            const cwData = await cwResponse.json();

            console.log(cwData);

            // Remove any existing results
            $("#cwResultDiv").empty();


            if (typeof cwData.message !== 'undefined') {
                $("#cwResultDiv").append();
                resultDisplay.append('<div>' + cwData.message + '</div>');
                resultParent.append(resultDisplay);
                $("#cwResultDiv").append(resultParent);
            } else {
                // Add update statistics
                resultDisplay.append('<div> Previous weight of ' + name + ': ' + cwData.old + ' lbs');
                resultDisplay.append('<div> Current weight of ' + name + ': ' + cwData.new + ' lbs');
                resultDisplay.append('<div> Weight difference: ' + cwData.diff + " lbs");
                resultParent.append(resultDisplay);
                $("#cwResultDiv").append(resultParent);
            }
        }
    })

    // Route 3: Cat Register

    $("#catRegisterSubmit").click(async function registerCat() {
        var name = $("#catRegisterName").val();
        var weight = $("#catRegisterWeight").val();

        const crUrl = "http://localhost:3000/catweights/register/" + name + "/" + weight;
        const crResponse = await fetch (crUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
        });

        // Convert response to JSON
        const crData = await crResponse.json();

        console.log(crData);

        // Remove any existing results
        $("#crResultDiv").empty();

        // Display the returned message
        var resultParent = $('<div class="p-2"></div>');
        var resultDisplay = $('<div class="p-2 border rounded-3 bg-light"></div>');
        resultDisplay.append('<div>' + crData.message + '</div');
        resultParent.append(resultDisplay);
        $("#crResultDiv").append(resultParent);
    })

    // Route 4: Cat Delete

    $("#catDeleteSubmit").click(async function deleteCat() {
        var name = $("#catDeleteName").val();

        const cdUrl = "http://localhost:3000/catdelete/" + name ;
        const cdResponse = await fetch (cdUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
        });

        // Convert response to JSON
        const cdData = await cdResponse.json();

        console.log(cdData);

        // Remove any existing results
        $("#cdResultDiv").empty();

        // Display the returned message
        var resultParent = $('<div class="p-2"></div>');
        var resultDisplay = $('<div class="p-2 border rounded-3 bg-light"></div>');
        resultDisplay.append('<div>' + cdData.message + '</div');
        resultParent.append(resultDisplay);
        $("#cdResultDiv").append(resultParent);
    });
});