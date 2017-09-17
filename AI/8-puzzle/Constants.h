// Constants.h
#ifndef CONSTANTS_H
#define CONSTANTS_H

// note to cast from int to enum see:
// https://stackoverflow.com/questions/11452920/how-to-cast-int-to-enum-in-c
// or use the following: static_cast<SelectedHeuristic>(i)
enum SelectedHeuristic
{
    Zero, //Uniform Cost Search
    // https://heuristicswiki.wikispaces.com/Misplaced+Tiles
    Displacement, // [0, 8] number of tiles 
                  // not in correct place
    // see https://heuristicswiki.wikispaces.com/Manhattan+Distance
    Manhattan, // manhattan distance from goal
    // see https://heuristicswiki.wikispaces.com/Tiles+out+of+row+and+column
    TilesOutRowCol // tiles not in proper row + not in column 
};

#endif
