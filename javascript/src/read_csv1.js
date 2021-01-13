// sent a GET request to retrieve the CSV file contents
$.ajax({
    url: "../data/alpha1.csv",
    async: false,
    success: function (csvd) {
        alpha1 = $.csv.toArrays(csvd);
        //console.log(alpha)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
$.ajax({
    url: "../data/stddev1.csv",
    async: false,
    success: function (csvd) {
        stddev1 = $.csv.toArrays(csvd);
        //console.log(stddev)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
        //alert("stddev read done"+stddev1.length);
    }
});
$.ajax({
    url: "../data/basisMatrix1.csv",
    async: false,
    success: function (csvd) {
        basisMatrix1 = $.csv.toArrays(csvd);
        //console.log(basisMatrix)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
        //alert("basisMatrix read done"+basisMatrix1.length);
    }
});
$.ajax({
    url: "../data/meanVector1.csv",
    async: false,
    success: function (csvd) {
        meanVector1 = $.csv.toArrays(csvd);
        //console.log(meanVector)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
$.ajax({
    url: "../data/meanShape1.csv",
    async: false,
    success: function (csvd) {
        meanShape1 = $.csv.toArrays(csvd);
        //console.log(meanShape)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
