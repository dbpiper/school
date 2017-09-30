#ifndef GREEDY_H
#define GREEDY_H
// greedy.h
// Author: David Piper
// Description:
// The purpose of this file is to be the header for the program
// performing hill climbing.

#include <cstdlib>
#include <iostream>
#include <string>
#include <cmath>

#include "SumofGaussians.h"
#include "helper.h"

double generateRandomPoint(double point[], int dims);
double movePoint(double point[], int dims,
    SumofGaussians *sog);

double printPoint(double point[], int dims);
double printStep(double point[], int dims, double value);


#endif
