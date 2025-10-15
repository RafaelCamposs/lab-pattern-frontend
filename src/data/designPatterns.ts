export interface DesignPattern {
  id: string;
  name: string;
  category: 'Creational' | 'Structural' | 'Behavioral';
  description: string;
  code: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
    typescript: string;
  };
}

const standardCode = {
  javascript: `// Write your code here

function main() {
  // Your implementation
}

main();`,
  python: `# Write your code here

def main():
    # Your implementation
    pass

if __name__ == "__main__":
    main()`,
  java: `// Write your code here

public class Main {
    public static void main(String[] args) {
        // Your implementation
    }
}`,
  cpp: `#include <iostream>

// Write your code here

int main() {
    // Your implementation
    return 0;
}`,
  typescript: `// Write your code here

function main(): void {
  // Your implementation
}

main();`
};

export const designPatterns: DesignPattern[] = [
  // ============ CREATIONAL PATTERNS ============
  {
    id: 'singleton',
    name: 'Singleton',
    category: 'Creational',
    description: `The Singleton pattern ensures a class has only one instance and provides a global point of access to it.

Use this pattern when:
- There must be exactly one instance of a class
- The sole instance should be extensible by subclassing
- You want to control access to a shared resource

Key Components:
- Private constructor to prevent instantiation
- Static instance variable
- Static method to get the instance

Common Use Cases:
- Configuration managers
- Database connection pools
- Logging services
- Cache managers`,
    code: standardCode
  },
  {
    id: 'factory-method',
    name: 'Factory Method',
    category: 'Creational',
    description: `The Factory Method pattern defines an interface for creating an object, but lets subclasses decide which class to instantiate.

Use this pattern when:
- A class can't anticipate the class of objects it must create
- A class wants its subclasses to specify the objects it creates
- Classes delegate responsibility to helper subclasses

Key Components:
- Product interface
- Concrete products
- Creator class with factory method
- Concrete creators

Common Use Cases:
- UI frameworks (creating buttons, dialogs)
- Document management systems
- Game development (creating characters, items)`,
    code: standardCode
  },
  {
    id: 'abstract-factory',
    name: 'Abstract Factory',
    category: 'Creational',
    description: `The Abstract Factory pattern provides an interface for creating families of related or dependent objects without specifying their concrete classes.

Use this pattern when:
- A system should be independent of how its products are created
- A system should be configured with one of multiple families of products
- A family of related product objects is designed to be used together

Key Components:
- Abstract factory interface
- Concrete factories
- Abstract product interfaces
- Concrete products

Common Use Cases:
- Cross-platform UI toolkits
- Database access layers
- Theme managers`,
    code: standardCode
  },
  {
    id: 'builder',
    name: 'Builder',
    category: 'Creational',
    description: `The Builder pattern separates the construction of a complex object from its representation, allowing the same construction process to create different representations.

Use this pattern when:
- The algorithm for creating a complex object should be independent of the parts
- The construction process must allow different representations
- You want to construct complex objects step by step

Key Components:
- Builder interface
- Concrete builders
- Product
- Director (optional)

Common Use Cases:
- Building complex objects (computers, cars)
- Query builders
- Document generators
- Meal/menu builders`,
    code: standardCode
  },
  {
    id: 'prototype',
    name: 'Prototype',
    category: 'Creational',
    description: `The Prototype pattern creates new objects by copying an existing object, known as the prototype.

Use this pattern when:
- Classes to instantiate are specified at run-time
- Avoiding building a class hierarchy of factories
- Instances of a class can have one of only a few different combinations of state

Key Components:
- Prototype interface with clone method
- Concrete prototypes
- Client that clones prototypes

Common Use Cases:
- Object cloning and copying
- Creating objects with expensive initialization
- Undo/redo functionality
- Game object spawning`,
    code: standardCode
  },

  // ============ STRUCTURAL PATTERNS ============
  {
    id: 'adapter',
    name: 'Adapter',
    category: 'Structural',
    description: `The Adapter pattern converts the interface of a class into another interface clients expect, allowing classes to work together that couldn't otherwise.

Use this pattern when:
- You want to use an existing class with an incompatible interface
- You want to create a reusable class that cooperates with unrelated classes
- You need to use several existing subclasses but can't adapt their interface by subclassing

Key Components:
- Target interface
- Adaptee (existing class)
- Adapter
- Client

Common Use Cases:
- Legacy code integration
- Third-party library integration
- API versioning
- Data format conversion`,
    code: standardCode
  },
  {
    id: 'bridge',
    name: 'Bridge',
    category: 'Structural',
    description: `The Bridge pattern decouples an abstraction from its implementation so that the two can vary independently.

Use this pattern when:
- You want to avoid a permanent binding between abstraction and implementation
- Both abstractions and implementations should be extensible by subclassing
- Changes in implementation should not impact clients
- You want to hide implementation details from clients

Key Components:
- Abstraction
- Refined Abstraction
- Implementor interface
- Concrete Implementors

Common Use Cases:
- Graphics and windowing systems
- Device drivers
- Database drivers
- Cross-platform applications`,
    code: standardCode
  },
  {
    id: 'composite',
    name: 'Composite',
    category: 'Structural',
    description: `The Composite pattern composes objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects and compositions uniformly.

Use this pattern when:
- You want to represent part-whole hierarchies of objects
- You want clients to ignore the difference between compositions and individual objects
- The structure can have any level of complexity and is dynamic

Key Components:
- Component interface
- Leaf objects
- Composite objects
- Client

Common Use Cases:
- File system structures
- GUI component hierarchies
- Organization structures
- Graphics systems (shapes, groups)`,
    code: standardCode
  },
  {
    id: 'decorator',
    name: 'Decorator',
    category: 'Structural',
    description: `The Decorator pattern attaches additional responsibilities to an object dynamically, providing a flexible alternative to subclassing for extending functionality.

Use this pattern when:
- You want to add responsibilities to individual objects dynamically and transparently
- Responsibilities can be withdrawn
- Extension by subclassing is impractical
- You want to avoid an explosion of subclasses

Key Components:
- Component interface
- Concrete Component
- Decorator base class
- Concrete Decorators

Common Use Cases:
- Adding features to UI components
- Stream/IO wrappers
- Middleware in web frameworks
- Adding features to text or graphics`,
    code: standardCode
  },
  {
    id: 'facade',
    name: 'Facade',
    category: 'Structural',
    description: `The Facade pattern provides a unified interface to a set of interfaces in a subsystem, making the subsystem easier to use.

Use this pattern when:
- You want to provide a simple interface to a complex subsystem
- There are many dependencies between clients and implementation classes
- You want to layer your subsystems

Key Components:
- Facade class
- Subsystem classes
- Client

Common Use Cases:
- Simplifying complex libraries
- API design
- Database access layers
- Home automation systems`,
    code: standardCode
  },
  {
    id: 'flyweight',
    name: 'Flyweight',
    category: 'Structural',
    description: `The Flyweight pattern uses sharing to support large numbers of fine-grained objects efficiently.

Use this pattern when:
- An application uses a large number of objects
- Storage costs are high because of the quantity of objects
- Most object state can be made extrinsic
- Many groups of objects may be replaced by relatively few shared objects

Key Components:
- Flyweight interface
- Concrete Flyweight
- Flyweight Factory
- Client

Common Use Cases:
- Text editor character rendering
- Game particle systems
- Database connection pooling
- Caching systems`,
    code: standardCode
  },
  {
    id: 'proxy',
    name: 'Proxy',
    category: 'Structural',
    description: `The Proxy pattern provides a surrogate or placeholder for another object to control access to it.

Use this pattern when:
- You need a more sophisticated reference to an object than a simple pointer
- You want to add a level of indirection to support lazy initialization, access control, or logging

Types of Proxies:
- Virtual Proxy: Controls access to expensive objects
- Protection Proxy: Controls access based on permissions
- Remote Proxy: Represents an object in different address space
- Smart Reference: Performs additional actions when object is accessed

Key Components:
- Subject interface
- Real Subject
- Proxy
- Client

Common Use Cases:
- Lazy loading
- Access control
- Logging and monitoring
- Remote object access (RPC)`,
    code: standardCode
  },

  // ============ BEHAVIORAL PATTERNS ============
  {
    id: 'chain-of-responsibility',
    name: 'Chain of Responsibility',
    category: 'Behavioral',
    description: `The Chain of Responsibility pattern avoids coupling the sender of a request to its receiver by giving more than one object a chance to handle the request.

Use this pattern when:
- More than one object may handle a request
- The handler isn't known a priori
- The set of objects that can handle a request should be specified dynamically

Key Components:
- Handler interface
- Concrete Handlers
- Client

Common Use Cases:
- Event handling systems
- Middleware chains
- Request processing pipelines
- Approval/authorization workflows`,
    code: standardCode
  },
  {
    id: 'command',
    name: 'Command',
    category: 'Behavioral',
    description: `The Command pattern encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

Use this pattern when:
- You want to parameterize objects with actions to perform
- You want to specify, queue, and execute requests at different times
- You want to support undo operations
- You want to support logging changes

Key Components:
- Command interface
- Concrete Commands
- Invoker
- Receiver
- Client

Common Use Cases:
- Undo/redo functionality
- Macro recording
- Transaction systems
- Job queues
- GUI buttons and menu items`,
    code: standardCode
  },
  {
    id: 'interpreter',
    name: 'Interpreter',
    category: 'Behavioral',
    description: `The Interpreter pattern defines a representation for a grammar along with an interpreter that uses the representation to interpret sentences in the language.

Use this pattern when:
- The grammar is simple
- Efficiency is not a critical concern
- You want to represent domain rules or expressions

Key Components:
- Abstract Expression
- Terminal Expression
- Non-terminal Expression
- Context
- Client

Common Use Cases:
- SQL parsing
- Regular expressions
- Mathematical expressions
- Configuration file parsing
- Domain-specific languages`,
    code: standardCode
  },
  {
    id: 'iterator',
    name: 'Iterator',
    category: 'Behavioral',
    description: `The Iterator pattern provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

Use this pattern when:
- You want to access an aggregate object's contents without exposing its internal structure
- You want to support multiple traversals of aggregate objects
- You want to provide a uniform interface for traversing different aggregate structures

Key Components:
- Iterator interface
- Concrete Iterator
- Aggregate interface
- Concrete Aggregate

Common Use Cases:
- Collection traversal
- Database result sets
- File system navigation
- Menu systems`,
    code: standardCode
  },
  {
    id: 'mediator',
    name: 'Mediator',
    category: 'Behavioral',
    description: `The Mediator pattern defines an object that encapsulates how a set of objects interact, promoting loose coupling by keeping objects from referring to each other explicitly.

Use this pattern when:
- A set of objects communicate in well-defined but complex ways
- Reusing an object is difficult because it refers to many other objects
- Behavior distributed between several classes should be customizable without subclassing

Key Components:
- Mediator interface
- Concrete Mediator
- Colleague classes
- Client

Common Use Cases:
- Chat rooms
- Air traffic control systems
- GUI dialog boxes
- Event bus systems`,
    code: standardCode
  },
  {
    id: 'memento',
    name: 'Memento',
    category: 'Behavioral',
    description: `The Memento pattern captures and externalizes an object's internal state without violating encapsulation, allowing the object to be restored to this state later.

Use this pattern when:
- You need to save and restore snapshots of an object's state
- A direct interface to obtaining the state would expose implementation details
- You want to implement undo/redo mechanisms

Key Components:
- Memento (state storage)
- Originator (creates and restores from memento)
- Caretaker (manages mementos)

Common Use Cases:
- Undo/redo functionality
- Transaction rollback
- Game state saving
- Version control systems`,
    code: standardCode
  },
  {
    id: 'observer',
    name: 'Observer',
    category: 'Behavioral',
    description: `The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

Use this pattern when:
- An abstraction has two aspects, one dependent on the other
- A change to one object requires changing others
- An object should notify other objects without making assumptions about who they are

Key Components:
- Subject (Observable)
- Concrete Subject
- Observer interface
- Concrete Observers

Common Use Cases:
- Event handling systems
- Model-View-Controller (MVC)
- Data binding
- Real-time notifications
- Stock market monitoring`,
    code: standardCode
  },
  {
    id: 'state',
    name: 'State',
    category: 'Behavioral',
    description: `The State pattern allows an object to alter its behavior when its internal state changes, appearing to change its class.

Use this pattern when:
- An object's behavior depends on its state
- Operations have large, multipart conditional statements that depend on the object's state
- State-specific behavior should be defined independently

Key Components:
- Context
- State interface
- Concrete States

Common Use Cases:
- TCP connection states
- Vending machines
- Game character states
- Document workflow systems
- Media player states`,
    code: standardCode
  },
  {
    id: 'strategy',
    name: 'Strategy',
    category: 'Behavioral',
    description: `The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable, letting the algorithm vary independently from clients.

Use this pattern when:
- Many related classes differ only in their behavior
- You need different variants of an algorithm
- An algorithm uses data that clients shouldn't know about
- A class defines many behaviors using multiple conditional statements

Key Components:
- Strategy interface
- Concrete Strategies
- Context

Common Use Cases:
- Sorting algorithms
- Compression algorithms
- Payment processing methods
- Routing algorithms
- Validation strategies`,
    code: standardCode
  },
  {
    id: 'template-method',
    name: 'Template Method',
    category: 'Behavioral',
    description: `The Template Method pattern defines the skeleton of an algorithm in a method, deferring some steps to subclasses without changing the algorithm's structure.

Use this pattern when:
- You want to implement the invariant parts of an algorithm once
- Common behavior among subclasses should be factored and localized
- You want to control subclass extensions

Key Components:
- Abstract Class with template method
- Concrete Classes

Common Use Cases:
- Frameworks and libraries
- Data processing pipelines
- Game AI behavior
- Testing frameworks
- Document generation`,
    code: standardCode
  },
  {
    id: 'visitor',
    name: 'Visitor',
    category: 'Behavioral',
    description: `The Visitor pattern represents an operation to be performed on elements of an object structure, letting you define a new operation without changing the classes of the elements.

Use this pattern when:
- An object structure contains many classes with differing interfaces
- Many distinct and unrelated operations need to be performed
- The classes defining the object structure rarely change
- You want to avoid polluting classes with unrelated operations

Key Components:
- Visitor interface
- Concrete Visitors
- Element interface
- Concrete Elements
- Object Structure

Common Use Cases:
- Compiler AST operations
- Document element processing
- Tax calculation systems
- Reporting systems`,
    code: standardCode
  }
];

export const getPatternById = (id: string): DesignPattern | undefined => {
  return designPatterns.find(pattern => pattern.id === id);
};

export const getPatternByName = (name: string): DesignPattern | undefined => {
  return designPatterns.find(pattern => pattern.name === name);
};

export const getPatternsByCategory = (category: string): DesignPattern[] => {
  return designPatterns.filter(pattern => pattern.category === category);
};
