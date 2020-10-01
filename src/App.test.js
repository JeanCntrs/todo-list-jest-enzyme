import React from 'react';
import { render } from '@testing-library/react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, { Todo, TodoForm, useTodos } from './App';

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

    describe('Custom hook: useTodos', () => {
        test('should add a new item to todo list when running addTodo', () => {
            // Hooks can only be executed within a component.
            const Test = (props) => {
                const hook = props.hook();
                return <div {...hook}></div>;
            }
            const wrapper = shallow(<Test hook={useTodos} />);
            let props = wrapper.find('div').props();

            props.addTodo('Test text');
            props = wrapper.find('div').props();

            expect(props.todos[0]).toEqual({ text: 'Test text' });
        });

        test('should mark the first item in the list as completed when running completeTodo', () => {
            const Test = (props) => {
                const hook = props.hook();
                return <div {...hook}></div>;
            }
            const wrapper = shallow(<Test hook={useTodos} />);
            let props = wrapper.find('div').props();

            props.completeTodo(0);
            props = wrapper.find('div').props();

            expect(props.todos[0]).toEqual({ text: 'Todo 1', isCompleted: true });
        });

        test('should remove the first item from the todo list when running removeTodo', () => {
            const Test = (props) => {
                const hook = props.hook();
                return <div {...hook}></div>;
            }
            const wrapper = shallow(<Test hook={useTodos} />);
            let props = wrapper.find('div').props();

            props.removeTodo(0);
            props = wrapper.find('div').props();

            expect(props.todos).toEqual([
                { text: 'Todo 2', isCompleted: false },
                { text: 'Todo 3', isCompleted: false }
            ]);
            expect(props.todos).toHaveLength(2);
        });

        test('App', () => {
            const wrapper = mount(<App />);
            const prevent = jest.fn();

            wrapper.find('input').simulate('change', { target: { value: 'My todo!' } });
            wrapper.find('form').simulate('submit', { preventDefault: prevent });
            // Here the addTodo function is executed.

            const found = wrapper.find('.todo').at(0).text().includes('My todo!');

            expect(found).toEqual(true);
            expect(prevent.mock.calls).toEqual([[]]);
            // Or
            expect(prevent).toHaveBeenCalled();
            // Or
            expect(prevent).toHaveBeenCalledTimes(1);
        });
    });
});