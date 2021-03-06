package com.example

import java.io.{BufferedWriter, File, FileWriter}

import breeze.linalg.{Axis, DenseVector}
import scalismo.common.{DiscreteField, UnstructuredPointsDomain}
import scalismo.geometry.{EuclideanVector, _3D}
import scalismo.io.{MeshIO, StatismoIO}

object meshSampleDistance {
  def main(args: Array[String]): Unit = {
    scalismo.initialize()

    val dir = "D:\\data\\webSSM\\femur\\"
    val modelPath = dir+"femur.h5"
    val meshPath = dir+"femur.stl"

    val numModes = 30
    val sampleFactor = 3 //az har chand ta yekisho negah daar
    val postfix = "1"

    val ssm = StatismoIO.readStatismoMeshModel(new File(modelPath)).get
    val mesh = MeshIO.readMesh(new File(meshPath)).get

    val stddev = ssm.gp.variance.map(x => math.sqrt(x))
    val basisMatrix = ssm.gp.basisMatrix
    val meanVector = ssm.gp.meanVector
    val meanShape = ssm.mean
    val alpha = ssm.coefficients(mesh)

    var alpha_matrix = alpha.toDenseMatrix
    //println(alpha_matrix.size)
    alpha_matrix = alpha_matrix(::, 0 to numModes-1)
    breeze.linalg.csvwrite(new File(dir+"alpha"+postfix+".csv"), alpha_matrix.toDenseMatrix, separator = ',')


    var stddev_matrix = stddev.toDenseMatrix
    //println(stddev_matrix)
    stddev_matrix = stddev_matrix(::, 0 to numModes-1)
    breeze.linalg.csvwrite(new File(dir+"stddev"+postfix+".csv"), stddev_matrix.toDenseMatrix, separator = ',')


    var basis_matrix = basisMatrix
    basis_matrix = basis_matrix(::, 0 to numModes-1)
    //println(basis_matrix(::, 0).size-1)
    for(i <- (0 to basis_matrix(::,0).size-1).reverse){
      //      println("i:"+i)
      //      println("i/3:"+i/3)
      //      println("i/3 % sampleFactor:"+((i/3) % sampleFactor))
      if((i/3) % sampleFactor != 0) {
        basis_matrix = basis_matrix.delete(row=i, Axis._0)
        //        println((basis_matrix(::,0).size-1-i)*100/(basis_matrix(::,0).size-1)+"%")
      }
    }
    breeze.linalg.csvwrite(new File(dir+"basisMatrix"+postfix+".csv"), basis_matrix, separator = ',')

    var meanV_matrix = meanVector.toDenseMatrix
    for(i <- (0 to meanV_matrix.size-1).reverse){

      if((i/3) % sampleFactor != 0) {
        meanV_matrix = meanV_matrix.delete(col=i, Axis._1)
      }
    }
    breeze.linalg.csvwrite(new File(dir+"meanVector"+postfix+".csv"), meanV_matrix.toDenseMatrix, separator = ',')

    val meanShapePointsIterator = meanShape.pointSet.points.zipWithIndex.map{case(p, i) => (p.x, p.y, p.z)}
    var result = ""
    var i =0
    while(meanShapePointsIterator.hasNext){
      val next = meanShapePointsIterator.next
      if(i % sampleFactor == 0) {//i%sampleFactor == 0
        var cur_coords = next._1 + ","+ next._2 + "," + next._3
        result = result + cur_coords + "\n"
      }
      i = i+1
    }

    val meanShapeFilepath = dir+"meanShape"+postfix+".csv"
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
