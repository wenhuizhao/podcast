from app import create_app
import sys


print('-------start------')
print(sys.path)

app = create_app()
#bcrypt = Bcrypt(app)
# login_manager = LoginManager(app)
# login_manager.login_view = 'login'

if __name__ == '__main__':
    app.run(debug=True)
