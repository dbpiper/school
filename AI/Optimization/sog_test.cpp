// Joshua L. Phillips
// 10-15-2014
// SumofGaussians example
// Released to public domain

#include <iostream>
#include <cstdlib>

#include "SumofGaussians.h"

using namespace std;

int main(int argc, char* argv[]) {

  int seed = atoi(argv[1]);
  int dims = atoi(argv[2]);
  int ncenters = atoi(argv[3]);
  
  srand(seed);
  SumofGaussians sog(dims,ncenters);

  double input[dims];
  double dz[dims];

  for (int x = 0; x < dims; x++)
    cin >> input[x];
  while (!cin.eof()) {
    cout << sog.eval(input) << " ";
    sog.deriv(input,dz);
    for (int x = 0; x < dims; x++)
      cout << dz[x] << " ";
    cout << endl;
    for (int x = 0; x < dims; x++)
      cin >> input[x];    
  }
  
  return 0;
}
