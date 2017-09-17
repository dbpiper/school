all: random_board a-star
random_board:
	g++ -g -std=c++17 -o random_board random_board.cpp \
	EightPuzzleBoard.cpp \
	EightPuzzleMove.cpp

a-star:
	g++ -g -std=c++17 -o a-star a-star.cpp \
	EightPuzzleBoard.cpp \
	EightPuzzleMove.cpp EightPuzzleNode.cpp \
	EightPuzzleNodeManager.cpp

clean:
	rm -rf random_board a-star
