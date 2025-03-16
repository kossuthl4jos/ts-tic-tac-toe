type State = "X" | "O" | " ";

type GameBoard = [
  State,
  State,
  State,
  State,
  State,
  State,
  State,
  State,
  State
];

// Objectives
// Chcek the amount of X's and O's on the board
// Who is the next player?
// Is the game over? Need to check if there are 3 in a row, column, or diagonal
// Is it a draw? Check if the board is full.

// HELPER TYPES
type Extends<First, Second> = First extends Second ? true : false;

type AnyTrue<Check> = Extends<true, Check>;

// type Test = AnyTrue<string | number | true>; => Test: true

type Contains<Arr extends State[], ToCheck> = Extends<ToCheck, Arr[number]>;

// type TestArray = [string, number]; //=> [string | number]
// type TestArrayToUnion = [string, number][number]; //=> string | number, becuase it iterates over the array and gets the union of the types

type Len<Arr extends State[]> = Arr["length"];
type SameLength<A extends State[], B extends State[]> = Extends<Len<A>, Len<B>>;

// GAME LOGIC

type Count<
  RemainingBord extends State[],
  XCount extends "X"[] = [],
  OCount extends "O"[] = []
> = RemainingBord extends [infer Head, ...infer Tail extends State[]]
  ? Count<
      Tail,
      Head extends "X" ? [...XCount, "X"] : XCount,
      Head extends "O" ? [...OCount, "O"] : OCount
    >
  : [XCount, OCount];

//type TestCount = Count<[" ", "X", "O", " ", " ", " ", " ", " ", "X"]>; //=> type TestCount = [["X", "X"], ["O"]]

type CorrectXO<X extends State[], O extends State[]> = AnyTrue<
  SameLength<X, O> | SameLength<X, [...O, "O"]> // number of X's can be one more than O's becuase X goes first, so we add here one to the O's
>;

// type TestCorrectXO = CorrectXO<["X", "X", "X"], ["O", "O"]>; //=> type TestCorrectXO = true
// type TestCorrectXO = CorrectXO<["X"], ["O", "O"]>; //=> type TestCorrectXO = false

type WhoIsNext<X extends State[], O extends State[]> = SameLength<
  X,
  O
> extends true
  ? "X"
  : "O";

// type TestWhoIsNext = WhoIsNext<["X", "X", "X"], ["O", "O"]>; //=> type TestWhoIsNext = "O"
// type TestWhoIsNextEqual = WhoIsNext<["X", "X"], ["O", "O"]>; //=> type TestWhoIsNext = "X"

type AllSame<Arr extends [State, State, State]> = Arr extends
  | ["X", "X", "X"]
  | ["O", "O", "O"]
  ? true
  : false;

type WinCheck<Board extends GameBoard> = AnyTrue<
  | AllSame<[Board[0], Board[1], Board[2]]>
  | AllSame<[Board[3], Board[4], Board[5]]>
  | AllSame<[Board[6], Board[7], Board[8]]>
  | AllSame<[Board[0], Board[3], Board[6]]>
  | AllSame<[Board[1], Board[4], Board[7]]>
  | AllSame<[Board[2], Board[5], Board[8]]>
  | AllSame<[Board[0], Board[4], Board[8]]>
  | AllSame<[Board[2], Board[4], Board[6]]>
>;

type TypeTacToe<Board extends GameBoard> = Count<Board> extends [
  infer X extends State[],
  infer O extends State[]
]
  ? CorrectXO<X, O> extends true
    ? WinCheck<Board> extends true
      ? `${WhoIsNext<X, O> extends "X" ? "O" : "X"} wins!`
      : Contains<Board, " "> extends true
      ? `${WhoIsNext<X, O>} it's your turn!`
      : "Draw"
    : "Too many Xs or Os"
  : never;

type FirstGame = TypeTacToe<["X", "X", "O", "O", "X", "X", "X", "O", "O"]>;
