// sa.cpp

#include "sa.h"

const bool printN = true;
const bool printLast = true;
const double tempStep = 0.01;

double temp = 20;

random_device rd;
mt19937 gen(rd());
uniform_real_distribution<> probabilityDis(0, 1);
uniform_real_distribution<> moveDis(-0.01, 0.01);

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
        double oldPoint[dims];
        double currentValue;
        double valueChange;
        double oldValue;
        double tolerance = 0.00000001;
        int N = 0;

        generateRandomPoint(currentPoint, dims);
        currentValue = sog.eval(currentPoint);         
        valueChange = currentValue;

        while ((valueChange > tolerance 
                || arePointsSame(
                    currentPoint, oldPoint, dims)) 
               && N < 100000) {
            printStep(currentPoint, dims, currentValue);
            oldValue = currentValue;
            copyPoint(currentPoint, oldPoint, dims);
            // move the point by 0.01 * derivative
            movePoint(currentPoint, dims, &sog);    
            currentValue = sog.eval(currentPoint);
            valueChange = abs(currentValue - oldValue);
            temp -= tempStep;
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

bool acceptProbability(double probability)
{
    double randomChance = probabilityDis(gen);
    cout << "random chance: " << to_string(randomChance)
        << endl;

    if (randomChance > probability) {
        return true;
    } else {
        return false;
    }
}

double generateProbability(double newScore, double oldScore)
{
   return exp((newScore - oldScore) / temp); 
}

bool useNewPoint(double point[], int dims,
    double newPoint[], SumofGaussians *sog)
{
    double oldValue = sog->eval(point);
    double newValue = sog->eval(newPoint);

    if (newValue > oldValue) {
        return true;
    } else {
        double probability = generateProbability(newValue,
            oldValue);
        if (acceptProbability(probability)) {
            return true;
        }
    }
    return false;
}

double movePoint(double point[], int dims, 
    SumofGaussians *sog)
{
    double newPoint[dims];

    for (int i = 0; i < dims; i++) {
        double r = moveDis(gen);
        cout << "runif: " << r << endl;
        newPoint[i] = point[i] + r;
    }
    
    if (useNewPoint(point, dims,
        newPoint, sog)) { 
        for (int i = 0; i < dims; i++) {
            point[i] = newPoint[i];
        }
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
