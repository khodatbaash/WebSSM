//const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "http://127.0.0.1:5000/hello"
import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader';

//1- generate instance matrix point cloud
import {create, all} from 'mathjs'
const math = create(all)
for (let i=0; i<window.alpha1[0].length; i++){
    window.alpha1[0][i]=0
}
for (let i=0; i<window.alpha2[0].length; i++){
    window.alpha2[0][i]=0
}
function calculateInstanceMatrix(alpha, stddev, basisMatrix, meanVector, meanShape){
    ////console.log("alpha : "+alpha.length+"*"+alpha[0].length)
    ////console.log("stddev : "+stddev.length+"*"+stddev[0].length)
    var alpha_mul_stddev2 = math.dotMultiply(alpha, stddev); //1*16

    ////console.log("basisMatrix : "+basisMatrix.length+"*"+basisMatrix[0].length)
    var basis_transposed2 = math.transpose(basisMatrix); //16*window.basisMatrix1.length
    ////console.log("basis_transposed2 : "+basis_transposed2.length+"*"+basis_transposed2[0].length)

    ////console.log("alpha_mul_stddev2 : "+alpha_mul_stddev2.length+"*"+alpha_mul_stddev2[0].length)
    ////console.log("basis_transposed2 : "+basis_transposed2.length+"*"+basis_transposed2[0].length)
    var alstd_mul_bastran2 = math.multiply(alpha_mul_stddev2, basis_transposed2);
    var alstd_mulbastran_add_meaVec2 = math.add(alstd_mul_bastran2,meanVector)
    var instance2 = math.add(alstd_mulbastran_add_meaVec2, math.reshape(meanShape, [1,basisMatrix.length]))
    return instance2;
}
var instancePoints2 = math.reshape(calculateInstanceMatrix(window.alpha1, window.stddev1, window.basisMatrix1, window.meanVector1, window.meanShape1), [window.basisMatrix1.length/3, 3])
var instancePoints4 = math.reshape(calculateInstanceMatrix(window.alpha2, window.stddev2, window.basisMatrix2, window.meanVector2, window.meanShape2), [window.basisMatrix2.length/3, 3])

var surface1, surface2;
//2-turn instance matrix to a vtk point cloud
import vtkPoints from 'vtk.js/Sources/Common/Core/Points'
import vtkCellArray from 'vtk.js/Sources/Common/Core/CellArray'
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData'
function instanceMatrix2vtkPolydata(instancePoints, cntnr_nr){
    const pointArray = [];
    const cellArray = [];
    let points = null
    let pointCells = null;

    const polydata = vtkPolyData.newInstance();
    for (var i = 0; i < instancePoints.length; i++) {
        //Points
        pointArray.push(instancePoints[i][0]);
        pointArray.push(instancePoints[i][1]);
        pointArray.push(instancePoints[i][2]);
        //Cells
        cellArray.push(1);
        cellArray.push(i);
        /*
        if(i==0)
            cellArray.push(instancePoints.length-1)
        else
            cellArray.push(i-1)
        */
    }

    points = vtkPoints.newInstance({ values: Float32Array.from(pointArray) });
    pointCells = vtkCellArray.newInstance({ values: Uint16Array.from(cellArray) });

    polydata.setPoints(points);
    polydata.setVerts(pointCells);
    /*
    polydata.setLines(pointCells)
    */

    sendPointCloud(pointArray, cntnr_nr)
    return polydata
}
function assembleSurface(bufPoints, bufCells, bufNormals){
    const pointArray = [];
    const cellArray = [];
    const normalArray = [];

    let points = null
    let cells = null;
    let normals = null;

    const polydata = vtkPolyData.newInstance();

    for (var i = 0; i < bufPoints.length/3; i++) {
        //Points
        pointArray.push(bufPoints[i*3]);
        pointArray.push(bufPoints[i*3+1]);
        pointArray.push(bufPoints[i*3+2]);
    }
    for (var i = 0; i < bufCells.length/3; i++) {
        //Cells
        cellArray.push(3);
        cellArray.push(bufCells[i*3]);
        cellArray.push(bufCells[i*3+1]);
        cellArray.push(bufCells[i*3+2]);
    }
    for (var i = 0; i < bufNormals.length/3; i++) {
        //Points
        normalArray.push(bufNormals[i*3]);
        normalArray.push(bufNormals[i*3+1]);
        normalArray.push(bufNormals[i*3+2]);
    }

    points = vtkPoints.newInstance({ values: Float32Array.from(pointArray) });
    cells = vtkCellArray.newInstance({ values: Uint16Array.from(cellArray) });
    normals = vtkPoints.newInstance({ values: Float32Array.from(normalArray) });

    polydata.setPoints(points);
    polydata.setPolys(cells);
    polydata.getPointData().setNormals(normals)
//    polydata.setNormals(normals)
    //polydata.getPoints().setnormal(normals)

    window['surface'] = polydata
    //console.log("surface assembled")
    return polydata
}
var polyData = instanceMatrix2vtkPolydata(instancePoints2, 1)
var polyData4 = instanceMatrix2vtkPolydata(instancePoints4, 2)
window["polyDataTemp1"] = polyData
window["polyDataTemp2"] = polyData4
var sm_max_num = 15

//3-visualize point cloud
import 'vtk.js/Sources/favicon';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
var instancePointsTemp;
function setupController(containerId){
    const controller = document.getElementsByClassName("controller"+containerId)[0]

    let selector_div = document.createElement("div") //document.createElement("div")
    selector_div.setAttribute("id","selector_div"+containerId)
    selector_div.setAttribute("style", "position: absolute; background-color:gray; left: 0%; width: 100%; height: 5%; border: 0px solid #73AD21;")
    let selector = document.createElement("select")
    selector.setAttribute("style", "width:100%;")
    selector.setAttribute("id", "selector"+containerId)
    selector.addEventListener("change", function(){
        refreshVisualization(window["polyDataTemp1"], window["polyDataTemp2"]);
    })
    let selector_option0 = document.createElement("option");
    selector_option0.value="0"
    selector_option0.selected
    selector_option0.label="Points"
    selector.appendChild(selector_option0)
    let selector_option1 = document.createElement("option");
    selector_option1.value="1"
    //selector_option1.selected
    selector_option1.label="Surface"
    selector.appendChild(selector_option1)
    let selector_option2 = document.createElement("option");
    selector_option2.value="2"
    //selector_option2.selected
    selector_option2.label="Wireframe"
    selector.appendChild(selector_option2)
    selector_div.appendChild(selector)

    let buttons_div = document.createElement("div") //document.createElement("div")
    buttons_div.setAttribute("id","buttons_div"+containerId)
    buttons_div.setAttribute("style", "position: absolute; background-color:gray; top:5%;left: 0%; width: 100%; height: 5%; border: 0px solid #73AD21;")
    let btnMean = document.createElement("button")
    btnMean.id = "btnMean"+containerId
    btnMean.value = "Mean"
    btnMean.innerHTML="Mean"
    btnMean.setAttribute("style", "position: absolute; left: 0%; width: 50%; height: 100%;")
    btnMean.addEventListener("click",
        function (){
            for (let i=0; i<window["alpha"+containerId][0].length; i++){
                window[("alpha"+containerId)][0][i]=0
            }
            for(i=0;i<sm_max_num;i++){
                document.getElementById("rng_sm"+i+"_cntr"+containerId).value = 0
                document.getElementById("inp_sm"+i+"_cntr"+containerId).value = 0
            }

            //window["polyDataTemp1"] = polyData
            //window["polyDataTemp2"] = polyData4
            instancePointsTemp = math.reshape(calculateInstanceMatrix(window[("alpha"+containerId)], window[("stddev"+containerId)], window[("basisMatrix"+containerId)], window[("meanVector"+containerId)], window[("meanShape"+containerId)]), [window[("basisMatrix"+containerId)].length/3, 3])
            window["polyDataTemp"+containerId] = instanceMatrix2vtkPolydata(instancePointsTemp, containerId)
            refreshVisualization(window["polyDataTemp1"], window["polyDataTemp2"]);
})
    buttons_div.appendChild(btnMean)
    let btnRnd = document.createElement("button")
    btnRnd.id = "btnRandom"+containerId
    btnRnd.value = "Random"
    btnRnd.innerText="Random"
    btnRnd.setAttribute("style", "position: absolute; left: 50%; width: 50%; height: 100%;")
    btnRnd.addEventListener("click",
        function (){
            for (let i=0; i<window["alpha"+containerId][0].length; i++){
                window[("alpha"+containerId)][0][i]=Math.random()*6-3
            }
            for(i=0;i<sm_max_num;i++){
                document.getElementById("rng_sm"+i+"_cntr"+containerId).value = window[("alpha"+containerId)][0][i]
                document.getElementById("inp_sm"+i+"_cntr"+containerId).value = window[("alpha"+containerId)][0][i]
            }

            //window["polyDataTemp1"] = polyData
            //window["polyDataTemp2"] = polyData4
            instancePointsTemp = math.reshape(calculateInstanceMatrix(window[("alpha"+containerId)], window[("stddev"+containerId)], window[("basisMatrix"+containerId)], window[("meanVector"+containerId)], window[("meanShape"+containerId)]), [window[("basisMatrix"+containerId)].length/3, 3])
            window["polyDataTemp"+containerId] = instanceMatrix2vtkPolydata(instancePointsTemp, containerId)
            refreshVisualization(window["polyDataTemp1"], window["polyDataTemp2"]);
        })
    buttons_div.appendChild(btnRnd)

    let smodes_div = document.createElement("div")
    smodes_div.setAttribute("id", "smodes_div"+containerId)
    smodes_div.setAttribute("style", "position: absolute;overflow-y:scroll; background-color:gray; top:10%;left: 0%; width: 100%; height: 90%; border: 0px solid #73AD21;")

    var i;
    for (i = 0; i < sm_max_num; i++) {
        let smodes_div_1 = document.createElement("div")
        smodes_div_1 = setup_sm(containerId, i)
        smodes_div.appendChild(smodes_div_1)
    }

    controller.appendChild(selector_div)
    controller.appendChild(buttons_div)
    controller.appendChild(smodes_div)

}
function setup_sm(container_nr, sm_nr){
    let smode_div_i = document.createElement("div")
    smode_div_i.setAttribute("style", "position: absolute; background-color:white; top:"+sm_nr*10+"%; left: 0%; width: 100%; height: 10%; border: 0px solid #73AD21;")
    let sm_lbl = document.createElement("label")
    let sm_rng = document.createElement("input")
    sm_rng.setAttribute("id", "rng_"+"sm"+sm_nr+"_cntr"+container_nr)
    sm_rng.type = "range"
    let sm_input = document.createElement("input")
    sm_input.id = "inp_"+"sm"+sm_nr+"_cntr"+container_nr
    sm_input.type = "number"


    sm_lbl.setAttribute("for", "sm"+sm_nr+"_cntr"+container_nr)
    sm_lbl.setAttribute("text","shape mode "+sm_nr)
    sm_lbl.setAttribute("style", "position: absolute; top:30% ;left: 0%; width: 25%; height: 100%; border: 0px solid #73AD21;")
    sm_lbl.innerHTML = "shape mode "+sm_nr
    smode_div_i.appendChild(sm_lbl)

    sm_rng.min = "-3"
    sm_rng.max = "3"
    sm_rng.value = "0"
    sm_rng.step = "any"
    sm_rng.addEventListener('input', (e) => {
        sm_input.value = sm_rng.value;
        window[("alpha"+container_nr)][0][sm_nr] = sm_rng.value
        //window["polyDataTemp1"] = polyData
        //window["polyDataTemp2"] = polyData4
        instancePointsTemp = math.reshape(calculateInstanceMatrix(window[("alpha"+container_nr)], window[("stddev"+container_nr)], window[("basisMatrix"+container_nr)], window[("meanVector"+container_nr)], window[("meanShape"+container_nr)]), [window[("basisMatrix"+container_nr)].length/3, 3])
        ////console.log("polyDataTemp"+container_nr+"sm"+sm_nr)
        window["polyDataTemp"+container_nr] = instanceMatrix2vtkPolydata(instancePointsTemp, container_nr)
        refreshVisualization(window["polyDataTemp1"], window["polyDataTemp2"]);
    });
    sm_rng.setAttribute("style", "position: absolute; left: 25%; width: 60%; height: 100%; border: 0px solid #73AD21;")
    smode_div_i.appendChild(sm_rng)

    sm_input.value = "0"
    sm_input.min = "-3"
    sm_input.max = "3"
    sm_input.step = "0.1"
    sm_input.addEventListener('input', function (){sm_rng.value = sm_input.value;}, true)
    sm_input.setAttribute("style", "position: absolute; left: 85%; width: 15%; height: 100%; border: 0px solid #73AD21;")
    smode_div_i.appendChild(sm_input)
    return smode_div_i
}
function setupContainer(containerId, containerHeight){
    const container = document.createElement("div")
    container.setAttribute("class","container"+containerId)
    container.setAttribute("style", "position: absolute; top:"+(containerId-1)*containerHeight*100+"%;width: 100%; height: "+containerHeight*100+"%; border: 2px solid #73AD21;")

    document.body.append(container)

    //add controller
    const controller = document.createElement("div") //document.createElement("div")
    controller.setAttribute("class","controller"+containerId)
    controller.setAttribute("style", "position: absolute; background-color:white; left: 0%; width: 25%; height: 100%; border: 0px solid #73AD21;")
    //controller.innerHTML = controlPanel
    container.appendChild(controller)
    //add canvas
    const canvas = document.createElement("div") //document.createElement("div")
    canvas.setAttribute("class","canvas"+containerId)
    canvas.setAttribute("style", "position: absolute; left:25%; width: 75%; height: 100%; border: 0px solid #73AD21;")
    container.appendChild(canvas)

}
function setupRendering(containerId){
    var renderWindow = vtkRenderWindow.newInstance();
    var renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
    renderWindow.addRenderer(renderer);

    var coneSource = vtkConeSource.newInstance({ height: 1.0 });
    var mapper = vtkMapper.newInstance();
    mapper.setInputConnection(coneSource.getOutputPort());
    var actor = vtkActor.newInstance();
    actor.setMapper(mapper);
    actor.getProperty().setPointSize(3);

    var openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
    renderWindow.addView(openglRenderWindow);
    var canvas = document.getElementsByClassName("canvas"+containerId)[0]
    openglRenderWindow.setContainer(canvas)
    const { width, height } = canvas.getBoundingClientRect();
    openglRenderWindow.setSize(width, height);

    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setView(openglRenderWindow);
    interactor.initialize();
    interactor.bindEvents(canvas);

    interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());

    return [renderWindow, renderer, mapper, actor];
}
var renderWindow1, renderer1, mapper1, actor1;
var renderWindow2, renderer2, mapper2, actor2;
function prepareScene() {
    ////console.log("prepare scene starts")
    setupContainer(1, 0.5)
    setupContainer(2, 0.5)
    var rendering1 = setupRendering(1)
    renderWindow1 = rendering1[0]
    renderer1 = rendering1[1]
    mapper1 = rendering1[2]
    actor1 = rendering1[3]

    var rendering2 = setupRendering(2)
    renderWindow2 = rendering2[0]
    renderer2 = rendering2[1]
    mapper2 = rendering2[2]
    actor2 = rendering2[3]
    ////console.log("prepare scene done")
}
function visualise(polydata1, polydata2){
    if(document.getElementById("selector1").value==0)
        mapper1.setInputData(polydata1);
    else
        mapper1.setInputData(window["asmSurface1"])

    renderer1.addActor(actor1);
    //renderer.setBackground(0.9,0.9,0.9)

    renderer1.resetCamera();
    renderWindow1.render();

    if(document.getElementById("selector2").value==0)
        mapper2.setInputData(polydata2);
    else
        mapper2.setInputData(window["asmSurface2"])

    renderer2.addActor(actor2);
    //renderer.setBackground(0.9,0.9,0.9)

    renderer2.resetCamera();
    renderWindow2.render();
}
function sendPointCloud(pointArray, cntnr_nr){
    // POST
    var current = new Date()
    //console.log("packing and sending point cloud #"+cntnr_nr+" at "+current+":"+current.getTime());
    fetch(url, {

        // Declare what type of data we're sending
        headers: {
            'Content-Type': 'application/json'
        },

        // Specify the method
        method: 'POST',

        // A JSON payload
        body: JSON.stringify({
            "array":pointArray, "cntr_nr":cntnr_nr
        }        )
    }).then(function (response) { // At this point, Flask has printed our JSON
        current = new Date()
        //console.log("response received for surface #"+cntnr_nr+" at "+current+":"+current.getTime());
        return response.text();
    }).then(function (text) {

        //console.log('POST response: ');

        // Should be 'OK' if everything was successful
        window["surface"+cntnr_nr] = JSON.parse(text);
        window["asmSurface"+cntnr_nr] = assembleSurface(window["surface"+cntnr_nr]["points"], window["surface"+cntnr_nr]["cells"], window["surface"+cntnr_nr]["normals"])
        //console.log("window surface "+cntnr_nr+" has been received")

        visualise(window["polyDataTemp1"], window["polyDataTemp2"])
    });
}
const reader = vtkSTLReader.newInstance();

//function visualizeSurface(){}
prepareScene()
setupController(1)
setupController(2)
visualise(polyData, polyData4)
//ace()

//4-interactive working with shape modes
function refreshVisualization(polyDataTemp1, polyDataTemp2){
    visualise(polyDataTemp1, polyDataTemp2);
    //visualizeSurface()
}