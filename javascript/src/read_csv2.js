// sent a GET request to retrieve the CSV file contents
$.ajax({
    url: "../data/alpha2.csv",
    async: false,
    success: function (csvd) {
        alpha2 = $.csv.toArrays(csvd);
        //console.log(alpha)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
$.ajax({
    url: "../data/stddev2.csv",
    async: false,
    success: function (csvd) {
        stddev2 = $.csv.toArrays(csvd);
        //console.log(stddev)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
$.ajax({
    url: "../data/basisMatrix2.csv",
    async: false,
    success: function (csvd) {
        basisMatrix2 = $.csv.toArrays(csvd);
        //console.log(basisMatrix)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
$.ajax({
    url: "../data/meanVector2.csv",
    async: false,
    success: function (csvd) {
        meanVector2 = $.csv.toArrays(csvd);
        //console.log(meanVector)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
$.ajax({
    url: "../data/meanShape2.csv",
    async: false,
    success: function (csvd) {
        meanShape2 = $.csv.toArrays(csvd);
        //console.log(meanShape)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
