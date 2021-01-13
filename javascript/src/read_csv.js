// sent a GET request to retrieve the CSV file contents
$.ajax({
    url: "alpha.csv",
    async: false,
    success: function (csvd) {
        alpha = $.csv.toArrays(csvd);
        //console.log(alpha)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
$.ajax({
    url: "stddev.csv",
    async: false,
    success: function (csvd) {
        stddev = $.csv.toArrays(csvd);
        //console.log(stddev)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
$.ajax({
    url: "basisMatrix.csv",
    async: false,
    success: function (csvd) {
        basisMatrix = $.csv.toArrays(csvd);
        //console.log(basisMatrix)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
$.ajax({
    url: "meanVector.csv",
    async: false,
    success: function (csvd) {
        meanVector = $.csv.toArrays(csvd);
        //console.log(meanVector)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
$.ajax({
    url: "meanShape.csv",
    async: false,
    success: function (csvd) {
        meanShape = $.csv.toArrays(csvd);
        //console.log(meanShape)
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});
