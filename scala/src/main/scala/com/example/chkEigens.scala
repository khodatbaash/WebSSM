package com.example

import java.io._
import java.nio.file.{FileSystems, Files}
import java.util

import breeze.linalg.{*, DenseMatrix, DenseVector, diag}
import scalismo.common.{DiscreteField, PointId, UnstructuredPointsDomain}
import scalismo.geometry.{EuclideanVector, Point3D, _3D}
import scalismo.io.{MeshIO, StatismoIO}
import scalismo.statisticalmodel.DiscreteLowRankGaussianProcess.Eigenpair
import scalismo.ui.api.ScalismoUI

object chkEigens{
  def main(args: Array[String]): Unit = {
    scalismo.initialize()

    val dir = "D:\\data\\webSSM\\talus\\"
    val modelPath = dir+"talus.h5"
    val meshPath = dir+"talus.vtk"
    val shape_name = "talus"

    val ssm = StatismoIO.readStatismoMeshModel(new File(modelPath)).get
    val mesh = MeshIO.readMesh(new File(meshPath)).get

    val stddev = ssm.gp.variance.map(x => math.sqrt(x))
    val basisMatrix = ssm.gp.basisMatrix
    val meanVector = ssm.gp.meanVector
    val meanShape = ssm.mean
    val alpha = ssm.coefficients(mesh)

    breeze.linalg.csvwrite(new File(dir+"alpha_"+shape_name+".csv"), alpha.toDenseMatrix, separator = ',')
    breeze.linalg.csvwrite(new File(dir+"stddev_"+shape_name+".csv"), stddev.toDenseMatrix, separator = ',')
    breeze.linalg.csvwrite(new File(dir+"basisMatrix_"+shape_name+".csv"), basisMatrix, separator = ',')
    breeze.linalg.csvwrite(new File(dir+"meanVector_"+shape_name+".csv"), meanVector.toDenseMatrix, separator = ',')

    val meanShapePointsIterator = meanShape.pointSet.points.zipWithIndex.map{case(p, i) => (p.x, p.y, p.z)}
    var result = ""
    while(meanShapePointsIterator.hasNext){
      val next = meanShapePointsIterator.next
      result = result + next._1 + ","+ next._2 + "," + next._3 + "\n"
    }

    val meanShapeFilepath = dir+"meanShape_"+shape_name+".csv"
    val outputFile = new File(meanShapeFilepath)
    val bw = new BufferedWriter(new FileWriter(outputFile))
    bw.write(result)
    bw.close()
  }

  def eigenfunctionToBreezeVector(eigenfunction : DiscreteField[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]]) = {
    val eigenVector = DenseVector.zeros[Double](eigenfunction.domain.numberOfPoints * 3);
    for ((pointId, i) <- eigenfunction.domain.pointIds.zipWithIndex) {
      eigenVector(i * 3 until (i + 1) * 3) := eigenfunction(pointId).toBreezeVector
    }
    eigenVector
  }
}
