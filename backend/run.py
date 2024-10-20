
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

from app import create_app

app = create_app()
#bcrypt = Bcrypt(app)
# login_manager = LoginManager(app)
# login_manager.login_view = 'login'

if __name__ == '__main__':
    app.run(debug=True)