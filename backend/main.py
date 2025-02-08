from app import create_app
from app.services.scheduler_service import scheduler
import sys


print('-------start------')
print(sys.path)

app = create_app()
#bcrypt = Bcrypt(app)
# login_manager = LoginManager(app)
# login_manager.login_view = 'login'

if __name__ == '__main__':
    scheduler.init_app(app)
    scheduler.start()
    app.run(debug=True, host='0.0.0.0')
