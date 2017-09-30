all: greedy sa

sog_test:
	g++ -std=c++17 -o sog_test sog_test.cpp \
	SumofGaussians.cpp \

greedy:
	g++ -O2 -std=c++17 -o greedy greedy.cpp \
	SumofGaussians.cpp \
	helper.cpp

sa:
	g++ -g -std=c++17 -o sa sa.cpp \
	SumofGaussians.cpp \
	helper.cpp

clean:
	rm -rf greedy sa sog_test
