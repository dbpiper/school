// Joshua L. Phillips
// 10-15-2014
// SumofGaussians class
// Released to public domain

#ifndef SUMOFGAUSSIANS_H
#define SUMOFGAUSSIANS_H

double getRandom();

class SumofGaussians {
public:

  // Create a function of randomly placed convolved Gaussians within
  // the [0,10] unit cube.
  // dimensions -        The number of continuous dimensions in the
  //                     search space
  // number_of_centers - The number of gaussians to place in the
  //                     search space
  SumofGaussians(int dimensions, int number_of_centers);

  // Standard
  ~SumofGaussians();

  // Evaluate the function at the given point...
  double eval(double point[]) const;
  
  // Evaluate the partial derivatives of the function at the given point...
  void deriv(double point[], double d[]) const;

private:
  int D;
  int N;
  double **centers;
};

#endif
