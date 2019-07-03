import click from './dom/click.js';

const clickElement = element => () => click(element);

export default clickElement;