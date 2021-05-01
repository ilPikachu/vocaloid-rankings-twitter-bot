const logFailure = (...messages: string[]) => {
    messages.forEach (message => {
        console.error(message);
    });
}
export default logFailure;
