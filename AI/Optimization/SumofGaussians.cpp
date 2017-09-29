// Joshua L. Phillips
// 10-15-2014
// SumofGaussians class
// Released to public domain

#include "SumofGaussians.h"

#include <cmath>
#include <cstdlib>

double getRandom() {
  return ((1.0*rand()) / (RAND_MAX + 1.0));
}

SumofGaussians::SumofGaussians(int dimensions, int number_of_centers) {
  if (dimensions < 1 || number_of_centers < 1) {
    D=0;
    N=0;
    centers = NULL;
    return;
  }
  
  D = dimensions;
  N = number_of_centers;

  centers = new double*[N];
  
  for (int x = 0; x < N; x++) {
    centers[x] = new double[D];
    for (int y = 0; y < D; y++)
      centers[x][y] = (10.0 * random()) / (RAND_MAX + 1.0);
  }
}

SumofGaussians::~SumofGaussians() {
  if (centers) {
    for (int x = 0; x < N; x++)
      delete [] centers[x];
    delete centers;
  }
}

double SumofGaussians::eval(double point[]) const {
  double z = 0.0;
  for (int x = 0; x < N; x++) {
    double sum = 0.0;
    for (int y = 0; y < D; y++)
      sum += (point[y]-centers[x][y]) * (point[y]-centers[x][y]);
    z += exp(-sum);
  }
  return z;
}

void SumofGaussians::deriv(double point[], double d[]) const {
    for (int y = 0; y < D; y++)
      d[y] = 0.0;
    for (int x = 0; x < N; x++) {
      double sum = 0.0;
      for (int y = 0; y < D; y++)
	sum += (point[y]-centers[x][y]) * (point[y]-centers[x][y]);
      sum = exp(-sum);
      for (int y = 0; y < D; y++)
	d[y] -= sum * (2.0 * (point[y] - centers[x][y]));
    }
}
