create table if not exists mans(
  num serial primary key,
  name varchar
    );

create table if not exists child(
id serial primary key ,
owner int ,
foreign key(owner) references mans(num) on delete cascade
    );

    insert into mans values(default,'abu lulu'),(default,'ummu abdillah');
    insert into child values (default,1), (default,1);

    table mans;
    table child;

drop table if exists mans ;
drop table if exists child;

const dropUser = async()=>{

const sql = 'drop table users';
const res = await pool.query(sql);
}

const dropRide = async()=>{

const sql = 'drop table rides';
const res = await pool.query(sql);
}

const dropTables= async()=>{
await dropUser();
await dropRide();
}

dropTables()








