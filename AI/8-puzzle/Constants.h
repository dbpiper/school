// Constants.h
#ifndef CONSTANTS_H
#define CONSTANTS_H

// note to cast from int to enum see:
// https://stackoverflow.com/questions/11452920/how-to-cast-int-to-enum-in-c
// or use the following: static_cast<SelectedHeuristic>(i)
enum SelectedHeuristic
{
    Zero, //Uniform Cost Search
    Displacement, // [0, 8] number of tiles 
                  // not in correct place
    Manhattan, // manhattan distance from goal
    TilesOutRowCol // tiles not in proper row + not in column (1+2)
};

#endif
