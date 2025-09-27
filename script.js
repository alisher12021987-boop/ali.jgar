document.addEventListener('DOMContentLoaded', function() {
    // Typing effect for the terminal
    const text = "> Welcome to my personal terminal\n> Type 'help' for commands";
    let i = 0;
    const speed = 50; // typing speed in milliseconds
    const typingText = document.getElementById('typing-text');
    
    function typeWriter() {
        if (i < text.length) {
            // Add the next character
            typingText.innerHTML += text.charAt(i);
            
            // If we encounter a newline, add a <br> tag
            if (text.charAt(i) === '\n') {
                typingText.innerHTML = typingText.innerHTML.slice(0, -1) + '<br>';
            }
            
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // After typing is done, show the blinking cursor for a while
            setTimeout(() => {
                document.querySelector('.typing-effect .cursor').style.display = 'none';
            }, 2000);
        }
    }
    
    // Start the typing effect after a short delay
    setTimeout(typeWriter, 1000);
    
    // Matrix rain effect
    function createMatrixRain() {
        const canvas = document.createElement('canvas');
        const container = document.querySelector('body');
        
        // Set canvas size to window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Position the canvas behind everything
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Characters for the matrix effect
        const matrix = '01';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        
        // Set the number of drops
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // Random starting point
        }
        
        // Set the font
        ctx.font = `${fontSize}px monospace`;
        
        // Drawing the characters
        function draw() {
            // Black background with opacity for trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Set the color for the characters
            ctx.fillStyle = '#00ff00'; // Green color
            
            // Loop over drops
            for (let i = 0; i < drops.length; i++) {
                // Random character to print
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                
                // Draw the character
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                // Reset drop if it reaches the bottom or randomly
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                // Move the drop down
                drops[i]++;
            }
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Recalculate columns and reset drops
            const newColumns = canvas.width / fontSize;
            const newDrops = [];
            
            for (let i = 0; i < newColumns; i++) {
                if (i < drops.length) {
                    newDrops[i] = drops[i];
                } else {
                    newDrops[i] = Math.random() * -100;
                }
            }
            
            // Update drops array
            drops.length = 0;
            Array.prototype.push.apply(drops, newDrops);
        });
        
        // Start the animation
        setInterval(draw, 50);
    }
    
    // Start the matrix rain effect
    createMatrixRain();
    
    // Add interactive terminal commands
    const terminalBody = document.querySelector('.terminal-body');
    const terminalPrompt = document.querySelector('.terminal-prompt');
    
    // Create a new command line
    function createNewCommandLine() {
        const newPrompt = terminalPrompt.cloneNode(true);
        terminalBody.insertBefore(newPrompt, terminalPrompt);
        return newPrompt;
    }
    
    // Handle command input
    function handleCommand(command) {
        let output = '';
        
        switch(command.toLowerCase()) {
            case 'help':
                output = 'Available commands: help, about, skills, contact, clear';
                break;
            case 'about':
                output = 'I am Aliraxmon Anvarov, a junior developer specializing in C and Python programming.';
                break;
            case 'skills':
                output = 'C Programming, Python, Web Development, Problem Solving';
                break;
            case 'contact':
                output = 'Telegram: @alicheek_001\nPhone: +998 77 377 44 51';
                break;
            case 'clear':
                // Clear the terminal
                const content = document.querySelector('.content');
                if (content) {
                    content.style.display = 'none';
                }
                const prompts = document.querySelectorAll('.terminal-prompt');
                prompts.forEach((prompt, index) => {
                    if (index < prompts.length - 1) {
                        prompt.remove();
                    }
                });
                return; // Skip creating output for clear command
            case '':
                return; // Skip empty commands
            default:
                output = `Command not found: ${command}. Type 'help' for available commands.`;
        }
        
        // Create output element
        const outputElement = document.createElement('div');
        outputElement.className = 'command-output';
        outputElement.textContent = output;
        
        // Insert output before the prompt
        terminalBody.insertBefore(outputElement, terminalPrompt);
    }
    
    // Handle terminal input
    terminalBody.addEventListener('keydown', function(e) {
        const input = document.querySelector('.terminal-input');
        
        if (!input) {
            // Create input field if it doesn't exist
            if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
                const newPrompt = createNewCommandLine();
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'terminal-input';
                input.autofocus = true;
                
                // Insert input after the prompt text
                newPrompt.appendChild(document.createTextNode(' '));
                newPrompt.appendChild(input);
                
                // Focus the input
                input.focus();
                
                // Handle input submission
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const command = input.value.trim();
                        input.readOnly = true;
                        input.style.cursor = 'default';
                        handleCommand(command);
                    }
                });
                
                // Prevent default for the key that triggered input creation
                e.preventDefault();
            }
        }
    });
    
    // Initial focus on the terminal
    terminalBody.focus();
    
    // Add click to focus
    terminalBody.addEventListener('click', function() {
        terminalBody.focus();
    });
});
