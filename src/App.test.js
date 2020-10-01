import React from 'react';
import { render } from '@testing-library/react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, { Todo, TodoForm } from './App';

configure({ adapter: new Adapter() });

describe('App', () => {
    describe('Todo', () => {
        test('should execute completeTodo when clicking on complete', () => {
            const todo = {
                isCompleted: true,
                text: 'lala'
            };
            const index = 5;
            const completeTodo = jest.fn();
            // Return an array with the number of times it was called and their respective arguments.
            // completeTodo.mock.calls == [[1], [1, 2], [5]];
            const removeTodo = jest.fn();
            const wrapper = shallow(<Todo todo={todo} index={index} completeTodo={completeTodo} removeTodo={removeTodo} />);

            wrapper.find('button').at(0).simulate('click');

            expect(completeTodo.mock.calls).toEqual([[5]]);
            expect(removeTodo.mock.calls).toEqual([]);
        });

        test('should execute removeTodo when clicking on X', () => {
            const todo = {
                isCompleted: true,
                text: 'lala'
            };
            const index = 5;
            const completeTodo = jest.fn();
            const removeTodo = jest.fn();
            const wrapper = shallow(<Todo todo={todo} index={index} completeTodo={completeTodo} removeTodo={removeTodo} />);

            wrapper.find('button').at(1).simulate('click');

            expect(removeTodo.mock.calls).toEqual([[5]]);
            expect(completeTodo.mock.calls).toEqual([]);
        });
    });

    describe('TodoForm', () => {
        test('should call addTodo when the form has a value', () => {
            const addTodo = jest.fn();
            const prevent = jest.fn();
            const wrapper = shallow(<TodoForm addTodo={addTodo} />);

            wrapper.find('input').simulate('change', { target: { value: 'my new todo!' } });
            wrapper.find('form').simulate('submit', { preventDefault: prevent }); // preventDefault: () => {}

            expect(addTodo.mock.calls).toEqual([['my new todo!']]);
            expect(prevent.mock.calls).toEqual([[]]); // Called once without arguments.
        })

    });
});