#pragma once

//YYSTYPE defines the structure to hold values
//assoicated with tokens. This structure will 
//be defined in the parser //in the future
typedef union  {
	int		ival;	//integer value of INT token
} YYSTYPE;

extern YYSTYPE yylval;	//yylval will be defined in the driver.


# define INT 257
# define LPAREN 258
# define RPAREN 259
# define PLUS 260
# define MINUS 261
# define TIMES 262
# define DIVIDE 263
# define NEWLINE 264
