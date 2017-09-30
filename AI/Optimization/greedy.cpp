// greedy.cpp

#include "greedy.h"

using namespace std;

const bool printN = true;
const bool printLast = true;

int main(int argc, char* argv[])
{
   // make sure we got all the args
   if (argc == 4) {
        int seed = stoi(argv[1]);
        int dims = stoi(argv[2]);
        int ncenters = stoi(argv[3]);

        srand(seed);
        SumofGaussians sog(dims, ncenters);
        
        double currentPoint[dims];
        double currentValue;
        double valueChange;
        double oldValue;
        double tolerance = 0.00000001;
        int N = 0;

        generateRandomPoint(currentPoint, dims);
        currentValue = sog.eval(currentPoint);         
        valueChange = currentValue;

        while (valueChange > tolerance) {
            printStep(currentPoint, dims, currentValue);
            oldValue = currentValue;
            // move the point by 0.01 * derivative
            movePoint(currentPoint, dims, &sog);    
            currentValue = sog.eval(currentPoint);
            valueChange = abs(currentValue - oldValue);
            N++;
        }
        if (printN) {
            cout << "N=" << to_string(N) << endl;
        }
        if (printLast) {
            cout << "V=" << to_string(currentValue) << endl;
        }

   }
}

double generateRandomPoint(double point[], int dims)
{
    for (int i = 0; i < dims; i++) {
        point[i] = getRandom(10); 
    }
}

double movePoint(double point[], int dims, 
    SumofGaussians *sog)
{
    double derivs[dims];
    sog->deriv(point, derivs);
    double gamma = 0.01;

    for (int i = 0; i < dims; i++) {
        point[i] = point[i] + gamma * derivs[i];
    }

}

double printPoint(double point[], int dims)
{
    int i = 0;
    for (; i < dims; i++) {
        cout << to_string(point[i]) << " ";
    }
}

double printStep(double point[], int dims, double value)
{
    printPoint(point, dims);
    cout << to_string(value) << endl;
}
