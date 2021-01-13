# app.py
from flask import Flask, jsonify, request, render_template
import vtk
from reconstructSurface import ReconstructSurface
from vtk.util.misc import vtkGetDataRoot
from datetime import datetime
import time

VTK_DATA_ROOT = vtkGetDataRoot()

#p = vtk.vtkPoint()
import numpy as np
app = Flask(__name__)

@app.route('/hello', methods=['GET', 'POST'])
def hello():

    # POST request
    if request.method == 'POST':
        now = datetime.now()

        print('Incoming..')
        #print(type(request.get_json()["array"][0]))  # parse as JSON
        print(request.get_json()["cntr_nr"])
        points_array = request.get_json()["array"]
        cntr_nr = request.get_json()["cntr_nr"]
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print(f"received point cloud #{cntr_nr} at {current_time}:{int(round(time.time() * 1000))}")
        print(len(points_array))

        recsurf = ReconstructSurface()
        recsurf.pts = points_array
        recsurf.cntr_nr = cntr_nr

        cf = recsurf.reconstruct()
        #print(cf)

        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print(f"surface num #{cntr_nr} ready to pickup at {current_time}:{int(round(time.time() * 1000))}")

        return 'OK', 200

    # GET request
    else:
        message = {'greeting':'Hello from Flask!'}
        return jsonify(message)  # serialize and use JSON headers

#!/usr/bin/env python

# This example shows how to construct a surface from a point cloud.
# First we generate a volume using the
# vtkSurfaceReconstructionFilter. The volume values are a distance
# field. Once this is generated, the volume is countoured at a
# distance value of 0.0.

# import os
# import string
# import vtk
# from vtk.util.misc import vtkGetDataRoot
# VTK_DATA_ROOT = vtkGetDataRoot()
# data_folder = "E:\\data\\webSSM\\talus\\"
#
# # Read some points. Use a programmable filter to read them.
# pointSource = vtk.vtkProgrammableSource()
#
# def readPoints():
#     output = pointSource.GetPolyDataOutput()
#     points = vtk.vtkPoints()
#     output.SetPoints(points)
#
#     #file = open(os.path.normpath(os.path.join(data_folder, "point_cloud.pts")))
#
#     #line = file.readline()
#     while line:
#         data = line.split()
#         if data and data[0] == 'p':
#             x, y, z = float(data[1]), float(data[2]), float(data[3])
#             points.InsertNextPoint(x, y, z)
#         line = file.readline()
#
# pointSource.SetExecuteMethod(readPoints)
#
# # Construct the surface and create isosurface.
# surf = vtk.vtkSurfaceReconstructionFilter()
# surf.SetInputConnection(pointSource.GetOutputPort())
#
# cf = vtk.vtkContourFilter()
# cf.SetInputConnection(surf.GetOutputPort())
# cf.SetValue(0, 0.0)
#
# # Sometimes the contouring algorithm can create a volume whose gradient
# # vector and ordering of polygon (using the right hand rule) are
# # inconsistent. vtkReverseSense cures this problem.
# reverse = vtk.vtkReverseSense()
# reverse.SetInputConnection(cf.GetOutputPort())
# reverse.ReverseCellsOn()
# reverse.ReverseNormalsOn()
#
# map = vtk.vtkPolyDataMapper()
# map.SetInputConnection(reverse.GetOutputPort())
# map.ScalarVisibilityOff()
#
# surfaceActor = vtk.vtkActor()
# surfaceActor.SetMapper(map)
# surfaceActor.GetProperty().SetDiffuseColor(1.0000, 0.3882, 0.2784)
# surfaceActor.GetProperty().SetSpecularColor(1, 1, 1)
# surfaceActor.GetProperty().SetSpecular(.4)
# surfaceActor.GetProperty().SetSpecularPower(50)
#
# # Create the RenderWindow, Renderer and both Actors
# ren = vtk.vtkRenderer()
# renWin = vtk.vtkRenderWindow()
# renWin.AddRenderer(ren)
# iren = vtk.vtkRenderWindowInteractor()
# iren.SetRenderWindow(renWin)
#
# # Add the actors to the renderer, set the background and size
# ren.AddActor(surfaceActor)
# ren.SetBackground(1, 1, 1)
# renWin.SetSize(400, 400)
# ren.GetActiveCamera().SetFocalPoint(0, 0, 0)
# ren.GetActiveCamera().SetPosition(1, 0, 0)
# ren.GetActiveCamera().SetViewUp(0, 0, 1)
# ren.ResetCamera()
# ren.GetActiveCamera().Azimuth(20)
# ren.GetActiveCamera().Elevation(30)
# ren.GetActiveCamera().Dolly(1.2)
# ren.ResetCameraClippingRange()
#
# iren.Initialize()
# renWin.Render()
# iren.Start()
#
# filename = "test.stl"
#
# #sphereSource = vtk.vtkSphereSource()
# #sphereSource.Update()
#
# # Write the stl file to disk
# stlWriter = vtk.vtkSTLWriter()
# stlWriter.SetFileName(data_folder+"resultingMesh.stl")
# stlWriter.SetInputConnection(cf.GetOutputPort())
# stlWriter.Write()

@app.route('/test')
def test_page():
    # look inside `templates` and serve `index.html`
    return render_template('index.html')