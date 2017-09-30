#ifndef HELPER_H
#define HELPER_H

#include <cstdlib>

double getRandom(int value);
bool arePointsSame(double point1[], double point2[], 
    int dims);
void copyPoint(double point[], double outPoint[],
    int dims);

#endif
