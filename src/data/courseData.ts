import { Module } from '../types';

export const courseData: Module[] = [
  {
    id: 'm1',
    title: 'Module 1: Getting Started',
    lectures: [
      {
        id: 'l1_1',
        title: 'Introduction',
        videoId: 'rfscVS0vtbw',
        startTime: 0,
        endTime: 105,
        description: 'Welcome to the complete Python course! In this lecture, we will learn what Python is and why it is so popular.'
      },
      {
        id: 'l1_2',
        title: 'Installing Python & PyCharm',
        videoId: 'rfscVS0vtbw',
        startTime: 105,
        endTime: 400,
        description: 'Learn how to download and install Python and the PyCharm IDE on your computer (Mac & Windows).'
      },
      {
        id: 'l1_3',
        title: 'Setup & Hello World',
        videoId: 'rfscVS0vtbw',
        startTime: 400,
        endTime: 623,
        description: 'Write your very first Python program using the print() function to display text on the screen.'
      },
      {
        id: 'l1_4',
        title: 'Drawing a Shape',
        videoId: 'rfscVS0vtbw',
        startTime: 623,
        endTime: 906,
        description: 'Learn how order of execution works in Python by drawing a simple shape using multiple print statements.'
      },
      {
        id: 'l1_5',
        title: 'Variables & Data Types',
        videoId: 'rfscVS0vtbw',
        startTime: 906,
        endTime: 1623,
        description: 'Learn how to store data in variables and understand the basic data types in Python like strings, integers, and booleans.'
      }
    ]
  },
  {
    id: 'm2',
    title: 'Module 2: Basic Data & Operations',
    lectures: [
      {
        id: 'l2_1',
        title: 'Working With Strings',
        videoId: 'rfscVS0vtbw',
        startTime: 1623,
        endTime: 2298,
        description: 'Discover how to manipulate text data using string methods, concatenation, and indexing.'
      },
      {
        id: 'l2_2',
        title: 'Working With Numbers',
        videoId: 'rfscVS0vtbw',
        startTime: 2298,
        endTime: 2906,
        description: 'Learn how to perform mathematical operations, use built-in math functions, and import the math module.'
      },
      {
        id: 'l2_3',
        title: 'Getting Input From Users',
        videoId: 'rfscVS0vtbw',
        startTime: 2906,
        endTime: 3157,
        description: 'Make your programs interactive by accepting input from the user using the input() function.'
      },
      {
        id: 'l2_4',
        title: 'Building a Basic Calculator',
        videoId: 'rfscVS0vtbw',
        startTime: 3157,
        endTime: 3507,
        description: 'Apply what you have learned to build a simple calculator that adds two numbers together.'
      },
      {
        id: 'l2_5',
        title: 'Mad Libs Game',
        videoId: 'rfscVS0vtbw',
        startTime: 3507,
        endTime: 3790,
        description: 'Create a fun Mad Libs word game using variables and user input.'
      }
    ]
  },
  {
    id: 'm3',
    title: 'Module 3: Data Structures',
    lectures: [
      {
        id: 'l3_1',
        title: 'Lists',
        videoId: 'rfscVS0vtbw',
        startTime: 3790,
        endTime: 4244,
        description: 'Learn about Lists, a powerful data structure to store multiple items in a single variable.'
      },
      {
        id: 'l3_2',
        title: 'List Functions',
        videoId: 'rfscVS0vtbw',
        startTime: 4244,
        endTime: 4737,
        description: 'Explore various functions and methods to manipulate lists, such as append, insert, remove, and sort.'
      },
      {
        id: 'l3_3',
        title: 'Tuples',
        videoId: 'rfscVS0vtbw',
        startTime: 4737,
        endTime: 5055,
        description: 'Understand Tuples, which are similar to lists but immutable (cannot be changed after creation).'
      },
      {
        id: 'l3_4',
        title: 'Dictionaries',
        videoId: 'rfscVS0vtbw',
        startTime: 7637,
        endTime: 8053,
        description: 'Learn how to store data in key-value pairs using Dictionaries for fast lookups.'
      }
    ]
  },
  {
    id: 'm4',
    title: 'Module 4: Functions & Control Flow',
    lectures: [
      {
        id: 'l4_1',
        title: 'Functions',
        videoId: 'rfscVS0vtbw',
        startTime: 5055,
        endTime: 5651,
        description: 'Learn how to write reusable blocks of code using functions, pass parameters, and return values.'
      },
      {
        id: 'l4_2',
        title: 'Return Statement',
        videoId: 'rfscVS0vtbw',
        startTime: 5651,
        endTime: 6006,
        description: 'Understand how to get information back from a function using the return statement.'
      },
      {
        id: 'l4_3',
        title: 'If Statements',
        videoId: 'rfscVS0vtbw',
        startTime: 6006,
        endTime: 6847,
        description: 'Make decisions in your code using if, elif, and else statements.'
      },
      {
        id: 'l4_4',
        title: 'If Statements & Comparisons',
        videoId: 'rfscVS0vtbw',
        startTime: 6847,
        endTime: 7237,
        description: 'Use comparison operators (==, !=, >, <) inside your if statements to compare values.'
      },
      {
        id: 'l4_5',
        title: 'Building a better Calculator',
        videoId: 'rfscVS0vtbw',
        startTime: 7237,
        endTime: 7637,
        description: 'Upgrade your previous calculator to handle multiple operators using if statements.'
      }
    ]
  },
  {
    id: 'm5',
    title: 'Module 5: Loops & Logic',
    lectures: [
      {
        id: 'l5_1',
        title: 'While Loop',
        videoId: 'rfscVS0vtbw',
        startTime: 8053,
        endTime: 8421,
        description: 'Execute a block of code repeatedly as long as a condition is true using while loops.'
      },
      {
        id: 'l5_2',
        title: 'Building a Guessing Game',
        videoId: 'rfscVS0vtbw',
        startTime: 8421,
        endTime: 9164,
        description: 'Use a while loop and variables to build an interactive guessing game.'
      },
      {
        id: 'l5_3',
        title: 'For Loops',
        videoId: 'rfscVS0vtbw',
        startTime: 9164,
        endTime: 9680,
        description: 'Iterate over a sequence (like a list, tuple, or string) using for loops.'
      },
      {
        id: 'l5_4',
        title: 'Exponent Function',
        videoId: 'rfscVS0vtbw',
        startTime: 9680,
        endTime: 10033,
        description: 'Create your own exponent function using a for loop to multiply numbers.'
      }
    ]
  },
  {
    id: 'm6',
    title: 'Module 6: Advanced Concepts',
    lectures: [
      {
        id: 'l6_1',
        title: '2D Lists & Nested Loops',
        videoId: 'rfscVS0vtbw',
        startTime: 10033,
        endTime: 10361,
        description: 'Work with lists inside lists (2D grids) and use nested loops to iterate through them.'
      },
      {
        id: 'l6_2',
        title: 'Building a Translator',
        videoId: 'rfscVS0vtbw',
        startTime: 10361,
        endTime: 10818,
        description: 'Build a program that translates English words into a secret language using loops and if statements.'
      },
      {
        id: 'l6_3',
        title: 'Comments',
        videoId: 'rfscVS0vtbw',
        startTime: 10818,
        endTime: 11057,
        description: 'Learn how to write comments in your code to explain what it does and leave notes for yourself.'
      },
      {
        id: 'l6_4',
        title: 'Try / Except',
        videoId: 'rfscVS0vtbw',
        startTime: 11057,
        endTime: 11561,
        description: 'Learn how to handle errors gracefully using try and except blocks so your program does not crash.'
      }
    ]
  },
  {
    id: 'm7',
    title: 'Module 7: File Handling & Modules',
    lectures: [
      {
        id: 'l7_1',
        title: 'Reading Files',
        videoId: 'rfscVS0vtbw',
        startTime: 11561,
        endTime: 12086,
        description: 'Interact with the file system to read data from external text files.'
      },
      {
        id: 'l7_2',
        title: 'Writing to Files',
        videoId: 'rfscVS0vtbw',
        startTime: 12086,
        endTime: 12493,
        description: 'Learn how to append data to existing files and create new files using Python.'
      },
      {
        id: 'l7_3',
        title: 'Modules & Pip',
        videoId: 'rfscVS0vtbw',
        startTime: 12493,
        endTime: 13436,
        description: 'Import external modules into your code and use pip to install third-party Python packages.'
      }
    ]
  },
  {
    id: 'm8',
    title: 'Module 8: Object-Oriented Programming',
    lectures: [
      {
        id: 'l8_1',
        title: 'Classes & Objects',
        videoId: 'rfscVS0vtbw',
        startTime: 13436,
        endTime: 14257,
        description: 'Introduction to Object-Oriented Programming (OOP). Learn how to create your own data types using classes and objects.'
      },
      {
        id: 'l8_2',
        title: 'Building a Multiple Choice Quiz',
        videoId: 'rfscVS0vtbw',
        startTime: 14257,
        endTime: 14908,
        description: 'Use classes and objects to build a fully functional multiple-choice quiz.'
      },
      {
        id: 'l8_3',
        title: 'Object Functions',
        videoId: 'rfscVS0vtbw',
        startTime: 14908,
        endTime: 15157,
        description: 'Write functions inside your classes to give your objects specific behaviors and actions.'
      },
      {
        id: 'l8_4',
        title: 'Inheritance',
        videoId: 'rfscVS0vtbw',
        startTime: 15157,
        endTime: 15643,
        description: 'Learn how to create a class that inherits attributes and methods from another class.'
      },
      {
        id: 'l8_5',
        title: 'Python Interpreter',
        videoId: 'rfscVS0vtbw',
        startTime: 15643,
        endTime: 16000,
        description: 'Learn how to use the interactive Python interpreter in your terminal or command prompt.'
      }
    ]
  },
  {
    id: 'm9',
    title: '🌍 World Best: Harvard CS50P (16 Hours)',
    lectures: [
      {
        id: 'l9_1',
        title: 'Harvard CS50P Full Course',
        videoId: 'nLRL_NcnK-4',
        startTime: 0,
        endTime: 57600,
        description: 'The complete Harvard University CS50P course. One of the best Python courses in the world.'
      }
    ]
  },
  {
    id: 'm10',
    title: '🌍 World Best: Bro Code Python (12 Hours)',
    lectures: [
      {
        id: 'l10_1',
        title: 'Bro Code Python Full Course',
        videoId: 'ix9cRaBkVe0',
        startTime: 0,
        endTime: 43200,
        description: 'A massive 12-hour Python course for beginners by Bro Code. Covers everything from basics to advanced GUI.'
      }
    ]
  },
  {
    id: 'm11',
    title: '🌍 World Best: Programming with Mosh',
    lectures: [
      {
        id: 'l11_1',
        title: 'Python Tutorial for Beginners',
        videoId: '_uQrJ0TkZlc',
        startTime: 0,
        endTime: 3600,
        description: 'A very popular 1-hour crash course by Programming with Mosh. Perfect for a quick overview.'
      }
    ]
  },
  {
    id: 'm12',
    title: '🚀 Specialization: Data Science & Analysis',
    lectures: [
      {
        id: 'l12_1',
        title: 'Data Analysis with Python',
        videoId: 'r-uOLQOlfOU',
        startTime: 0,
        endTime: 14400,
        description: 'Learn Data Analysis with Python, Pandas, Numpy, and Matplotlib in this comprehensive course.'
      }
    ]
  },
  {
    id: 'm13',
    title: '🚀 Specialization: Web Dev (Django)',
    lectures: [
      {
        id: 'l13_1',
        title: 'Django Web Framework Full Course',
        videoId: 'F5mRW0jo-U4',
        startTime: 0,
        endTime: 14400,
        description: 'Learn how to build robust web applications using Python and the Django framework.'
      }
    ]
  },
  {
    id: 'm14',
    title: '🚀 Specialization: Machine Learning',
    lectures: [
      {
        id: 'l14_1',
        title: 'Machine Learning for Everybody',
        videoId: 'i_LwzRmA21k',
        startTime: 0,
        endTime: 14400,
        description: 'Learn Machine Learning using Python, TensorFlow, and Scikit-Learn.'
      }
    ]
  },
  {
    id: 'm15',
    title: '🚀 Specialization: Game Development',
    lectures: [
      {
        id: 'l15_1',
        title: 'Pygame Tutorial for Beginners',
        videoId: 'AY9MnQ4x3zk',
        startTime: 0,
        endTime: 14400,
        description: 'Learn how to make video games in Python using the Pygame library.'
      }
    ]
  },
  {
    id: 'm16',
    title: '🚀 Specialization: Automation & Bots',
    lectures: [
      {
        id: 'l16_1',
        title: 'Python Automation Tutorial',
        videoId: 'vEQ8CXEIcbg',
        startTime: 0,
        endTime: 7200,
        description: 'Learn how to automate boring tasks, web scraping, and building bots with Python.'
      }
    ]
  },
  {
    id: 'm17',
    title: '🧠 Advanced: Object Oriented Programming',
    lectures: [
      {
        id: 'l17_1',
        title: 'Python OOP Crash Course',
        videoId: 'Ej_02ICOIgs',
        startTime: 0,
        endTime: 7200,
        description: 'Deep dive into Object Oriented Programming in Python. Master classes, inheritance, and polymorphism.'
      }
    ]
  },
  {
    id: 'm18',
    title: '🧠 Advanced: Python APIs',
    lectures: [
      {
        id: 'l18_1',
        title: 'APIs for Beginners',
        videoId: 'W--_EOzdTHk',
        startTime: 0,
        endTime: 7200,
        description: 'Learn what APIs are and how to use them in Python using the requests library.'
      }
    ]
  }
];
