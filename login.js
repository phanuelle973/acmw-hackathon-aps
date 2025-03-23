// Handle login functionality
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Example: Validate with localStorage (simple check for demo)
  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (storedUser && storedUser.email === email && storedUser.password === password) {
      alert(`Login successful! Welcome back, ${storedUser.name}!`);
      // Redirect to the main app or dashboard
      window.location.href = 'acmw.html';
  } else {
      alert('Invalid email or password');
  }
});

// Handle signup functionality
document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  // Save user details to localStorage (for demo purposes)
  const newUser = { name, email, password };
  localStorage.setItem('user', JSON.stringify(newUser));

  alert(`Sign up successful! Hello, ${name}!`);
  
  // Redirect to login page
  window.location.href = 'login.html';
});
