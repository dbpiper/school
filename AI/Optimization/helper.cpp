
#include "helper.h"

double getRandom(int value)
{
    double r = (double)rand() / RAND_MAX;
    return r * value;
}

void copyPoint(double point[], double outPoint[], int dims)
{
    for (int i = 0; i < dims; i++) {
        outPoint[i] = point[i];
    }
}

bool arePointsSame(double point1[], double point2[], int dims)
{   
    for (int i = 0; i < dims; i++) {
        if (point1[i] != point2[i]) {
            return false;
        }
    }
    return true;
}
