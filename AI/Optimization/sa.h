#ifndef SA_H
#define SA_H
// sa.h
// Author: David Piper
// Description:
// The purpose of this file is to be the header for the 
// program performing simualated annealing

#include <cstdlib>
#include <iostream>
#include <string>
#include <cmath>
#include <random>

#include "SumofGaussians.h"
#include "helper.h"

using namespace std;

bool acceptProbability(double probability);
double generateProbability(double newScore, double oldScore);
double generateRandomPoint(double point[], int dims);
double movePoint(double point[], int dims, 
    SumofGaussians *sog);
double printPoint(double point[], int dims);
double printStep(double point[], int dims, double value);
bool useNewPoint(double point[], int dims, double newPoint[],
    SumofGaussians *sog);


#endif
