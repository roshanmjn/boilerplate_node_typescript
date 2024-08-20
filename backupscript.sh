# #!/bin/bash

# # DB information
# db_password="futsal#pwd69!"
# db_username="futsal_user_0"
# db_name="futsal_dev"
# db_host="localhost"
# db_port="5432"

# # Backup directory information
# backup_dir="/var/backups/postgres/databases"
# backup_file="$backup_dir/$(date +'%Y-%m-%d_%H-%M-%S')_$db_name.sql"

# # Set the PGPASSWORD environment variable
# export PGPASSWORD=$db_password

# # Perform the backup
# pg_dump -h $db_host -U $db_username -d $db_name > "$backup_file"

# unset PGPASSWORD