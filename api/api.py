from flask import jsonify
from flask import Flask,  request
from flask_mysqldb import MySQL

app = Flask(__name__, static_folder='../build', static_url_path='/')

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] ='root'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_DB'] = 'db01'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

#AUTHORS =============================================================================
#gets info about an author
@app.route('/api/author/<int:id>', methods=['GET'])
def author_getbooks(id):
    authorID = str(id)
    cur = mysql.connection.cursor()
    cur.execute(f'''select *
                    from Authors
                    where authorID={authorID}''')
    results = cur.fetchall()
    return jsonify(results)

#gets all the books of a certain author
@app.route('/api/author/<int:id>/get-books', methods=['GET'])
def author_getinfo(id):
    authorID = str(id)
    cur = mysql.connection.cursor()
    cur.execute(f'''select B.*
                    from Books B, Authors A, AuthorBond AB
                    where A.authorID={authorID} and A.authorID = AB.authorID and B.bookID = AB.bookID''')
    results = cur.fetchall()
    return jsonify(results)

#returns all authors and their count of books
@app.route('/api/allauthors', methods=['GET'])
def author_getall():
    cur = mysql.connection.cursor()
    cur.execute(f'''select A.*,
                    (select count(*)
                    from Books B, Authors A1, AuthorBond AB
                    where A1.authorID=A.authorID
                    and A1.authorID = AB.authorID and B.bookID = AB.bookID )
                    as booksCount
                    from Authors A
                    order by A.firstName
                ''')
    results = cur.fetchall()
    return jsonify(results)

#Publishers ==================================================================================
#returns all publishers and their count of books
@app.route('/api/allpublishers', methods=['GET'])
def publisher_getall():
    cur = mysql.connection.cursor()
    cur.execute(f'''select P.*,
                    (select count(*)
                    from Books B
                    where B.publisherID = P.publisherID )
                    as booksCount
                    from Publishers P
                    order by P.name
                ''')
    results = cur.fetchall()
    return jsonify(results)

#gets info about a publisher
@app.route('/api/publisher/<int:id>', methods=['GET'])
def publisher_getinfo(id):
    publisherID = str(id)
    cur = mysql.connection.cursor()
    cur.execute(f'''select *
                    from Publishers
                    where publisherID={publisherID}''')
    results = cur.fetchall()
    return jsonify(results)

#gets all books of a publisher
@app.route('/api/publisher/<int:id>/get-books', methods=['GET'])
def publisher_getbooks(id):
    publisherID = str(id)
    cur = mysql.connection.cursor()
    cur.execute(f'''select B.*, (select A.authorID
                                from Authors A, AuthorBond AB
                                where B.bookID = AB.bookID and AB.authorID = A.authorID limit 1)
                    as authorNameID,
                                (select CONCAT(A.firstName, " ", A.lastName)
                                from Authors A where A.authorID=authorNameID)
                    as authorName
                    from Books B
                    where B.publisherID = {publisherID} ''')
    results = cur.fetchall()
    return jsonify(results)


#BOOKS ====================================================================================================
#gets all information about books, including coresponding info from other tables through foreign keys
@app.route('/api/book/<int:id>', methods=['GET'])
def get_book(id):
    bookID = str(id)
    cur = mysql.connection.cursor()
    cur.execute(f'''select B.*, P.name as publisherName, P.publisherID as publisherID
                    from Books B, Publishers P 
                    where B.bookID={bookID} and B.publisherID = P.publisherID ;''')
    results = cur.fetchall()
    return jsonify(results)

@app.route('/api/book-rating/<int:id>', methods=['GET'])
def get_bookrating(id):
    bookID = str(id)
    cur = mysql.connection.cursor()
    cur.execute(f'''select Cast(avg(R.rating) as char(3)) as rating
                    from Reviews R
                    where R.bookID = {bookID}
                    group by R.bookID''')
    results = cur.fetchall()
    return jsonify(results)

#returns the list of authors of a book based on its id
@app.route('/api/book-authors/<int:id>', methods=['GET'])
def get_book_authors(id):
    bookID = str(id)
    cur = mysql.connection.cursor()
    cur.execute(f'''select A.firstName, A.lastName, A.authorID
                    from Books B, Authors A, AuthorBond AB
                    where B.bookID={bookID} and B.bookID = AB.bookID and AB.authorID = A.authorID ;''')
    results = cur.fetchall()
    return jsonify(results)

#gets all the books + first author(name, id) of each
#alphabetically
@app.route('/api/allbooks', methods=['GET'])
def get_allbooks():
    cur = mysql.connection.cursor()
    cur.execute(f'''select B.*, (select A.authorID
                                    from Authors A, AuthorBond AB
                                    where B.bookID = AB.bookID and AB.authorID = A.authorID limit 1)
                                    as authorNameID,
                                    (select CONCAT(A.firstName, " ", A.lastName)
                                    from Authors A where A.authorID=authorNameID)
                                    as authorName
                    from Books B order by B.title''')
    results = cur.fetchall()
    return jsonify(results)

#GENRES ================================================================================================= 
#get all genres
@app.route('/api/allgenres', methods=['GET'])
def get_allgenres():
    cur = mysql.connection.cursor()
    cur.execute(f'''select name from Genres order by name''')
    results = cur.fetchall()
    return jsonify(results)

#get all books of a selected genre
@app.route('/api/genres/<name>', methods=['GET'])
def get_booksfromgenre(name):
    cur = mysql.connection.cursor()
    cur.execute(f'''select B.*,
                            (select A.authorID
                            from Authors A, AuthorBond AB
                            where B.bookID = AB.bookID and AB.authorID = A.authorID limit 1)
                    as authorNameID,

                            (select CONCAT(A.firstName, " ", A.lastName)
                            from Authors A where A.authorID=authorNameID)
                    as authorName
                    from Books B 
                    where B.bookID in 
                    (select bookID from GenresBond GB, Genres G
                      where GB.genreID = G.genreID and G.name = '{name}'  ) 
                    order by B.title  
                    ''')
    results = cur.fetchall()
    return jsonify(results)


#get all genres of a book
@app.route('/api/genres-book/<id>', methods=['GET'])
def get_bookgenres(id):
    cur = mysql.connection.cursor()
    cur.execute(f'''select G.name from Genres G, GenresBond GB
                    where G.genreID = GB.genreID and GB.bookID={id} ''')
    results = cur.fetchall()
    return jsonify(results)

#get recommended books based on their genres
@app.route('/api/recommended/<bookID>', methods=['GET'])
def get_recommended(bookID):
    cur = mysql.connection.cursor()
    cur.execute(f'''select B.* , (select A.authorID
                                    from Authors A, AuthorBond AB
                                    where B.bookID = AB.bookID and AB.authorID = A.authorID limit 1)
                    as authorNameID,

                                    (select CONCAT(A.firstName, " ", A.lastName)
                                    from Authors A where A.authorID=authorNameID)
                    as authorName
                    from Books B,
                    (
                        select B.bookID as bookID
                        from Books B, GenresBond GB where 
                        B.bookID=GB.bookID and B.bookID!={bookID}
                        and GB.genreID in (select genreID from GenresBond where bookID={bookID})
                        group by B.bookID 
                        order by RAND()
                        limit 4
                    ) Recommended
                    where B.bookID=Recommended.bookID 
                    ''')
    results = cur.fetchall()
    return jsonify(results)

#FAVORITES ===============================================================================================
#adds the bond between a user and a favorite book
@app.route('/api/favorite/add', methods=['GET','POST'])
def favorite_add():
    if request.method == 'POST':
        bookID = request.json['bookID']
        userID = request.json['userID']
        cur = mysql.connection.cursor()
        cur.execute(f'''insert into FavoriteBooks(bookID, userID) values ({bookID},{userID});''')
        mysql.connection.commit()
        return 'done'
    else:
        return

#deletes a book from the favorites of a user
@app.route('/api/favorite/delete', methods=['GET','POST'])
def favorite_delete():
    if request.method == 'POST':
        bookID = request.json['bookID']
        userID = request.json['userID']
        cur = mysql.connection.cursor()
        cur.execute(f'''delete from FavoriteBooks where bookID={bookID} and userID={userID};''')
        mysql.connection.commit()
        return 'done'
    else:
        return 

#checks if a book is a favorite of a user
@app.route('/api/favorite/check/<bookID>-<userID>', methods=['GET'])
def favorite_check(bookID,userID):
    cur = mysql.connection.cursor()
    cur.execute(f'''select * from FavoriteBooks where userID={userID} and bookID={bookID};''')
    results = cur.fetchall()
    return jsonify(results)

#returns the number of favorite books of a user
@app.route('/api/favorite/user/count/<userID>', methods=['GET'])
def favorite_count(userID):
    cur = mysql.connection.cursor()
    cur.execute(f'''select count(*) as count from FavoriteBooks where userID={userID};''')
    results = cur.fetchall()
    return jsonify(results)

#returns all favorite books of a user and its correspondent author, maximum 1 author
@app.route('/api/favorite/user/<userID>', methods=['GET'])
def favorite_getall(userID):
    cur = mysql.connection.cursor()
    cur.execute(f'''select B.*, (select A.authorID
                                    from Authors A, AuthorBond AB
                                    where B.bookID = AB.bookID and AB.authorID = A.authorID limit 1)
                                    as authorNameID,
                                    (select CONCAT(A.firstName, " ", A.lastName)
                                    from Authors A where A.authorID=authorNameID)
                                    as authorName
                    from Books B
                    where B.bookID in (select bookID  from FavoriteBooks where userID={userID})
                ''')
    results = cur.fetchall()
    return jsonify(results)

#REVIEWS =====================================================================================
#adds a review to its table
@app.route('/api/add-review', methods=['GET','POST'])
def insert_review():
    if request.method == 'POST':
        bookID = request.json['bookID']
        userID = request.json['userID']
        textContent = request.json['textContent']
        date = request.json['date']
        rating = request.json['rating']
        likes = request.json['likes']

        cur = mysql.connection.cursor()
        cur.execute(f'''insert into Reviews(userID, bookID, textContent, date, rating, likes)
                        values("{userID}","{bookID}","{textContent}","{date}","{rating}","{likes}");''')
        mysql.connection.commit()
        return 'done'
    else:
        return 

#return all reviews of a book and the user of each
@app.route('/api/review/<bookID>', methods=['GET'])
def get_review(bookID):
    cur = mysql.connection.cursor()
    cur.execute(f'''select R.*, U.firstName, U.lastName
                    from Reviews R, Users U
                    where R.bookID={bookID} and R.userID=U.userID order by R.reviewID desc''')
    results = cur.fetchall()
    return jsonify(results)

#SEARCH ======================================================================================
#search for a book based on checking if the current string is a substring of the title of any book
@app.route('/api/short-search/<string>', methods=['GET'])
def get_results_from_shortsearch(string):
    cur = mysql.connection.cursor()
    cur.execute(f'''select bookID, title, coverPicture from Books WHERE title LIKE '%{string}%' limit 8;''')
    results = cur.fetchall()
    return jsonify(results)

#search for a book based on checking if the current string is a substring of the title of any book
@app.route('/api/long-search/<string>', methods=['GET'])
def get_results_from_longsearch(string):
    cur = mysql.connection.cursor()
    cur.execute(f'''select B.bookID, B.title, B.coverPicture, P.name
                    from Books B, Publishers P
                    where title LIKE '%{string}%'
                    and B.publisherID = P.publisherID
                ''')
    results = cur.fetchall()
    return jsonify(results)

#USERS =============================================================================================
@app.route('/api/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        username = request.json['username']
        password = request.json['password']
        cur = mysql.connection.cursor()
        cur.execute(" select * from Users where username='"+username+"' and password='"+ password +"';")
        results = cur.fetchall()
        return jsonify(results)
    else:
        return

@app.route('/api/signup', methods=['GET','POST'])
def signup():
    if request.method == 'POST':
        username = request.json['username']
        password = request.json['password']
        email = request.json['email']
        firstName = request.json['firstName']
        lastName = request.json['lastName']
        cur = mysql.connection.cursor()
        cur.execute(f'''insert into Users (username, password, email, firstName, lastName) 
                    values ('{username}','{password}','{email}','{firstName}','{lastName}')
                    ''')
        mysql.connection.commit()
        return 'done'
    else:
        return

@app.route('/api/checkuser/<username>', methods=['GET'])
def checkuser(username):
    cur = mysql.connection.cursor()
    cur.execute(f'''select * from Users
                    where username='{username}'
                ''')
    results = cur.fetchall()
    return jsonify(results)

#HOMEPAGE ===============================================================================
#high rated 8 books
@app.route('/api/homepage/highratedbooks', methods=['GET'])
def get_highratedbooks():
    cur = mysql.connection.cursor()
    cur.execute(f'''select B.*, Cast(mostPopular.rat as char(3)) as rating
                    from Books B,
                    (select B.bookID, avg(R.rating) as rat
                    from Books B, Reviews R
                    where R.bookID = B.bookID
                    group by B.bookID
                    ) mostPopular
                    where B.bookID = mostPopular.bookID
                    order by mostPopular.rat desc
                    limit 8
                    ''')
    results = cur.fetchall()
    return jsonify(results)



#return the 3 most popular publishers
@app.route('/api/homepage/popularpublishers', methods=['GET'])
def get_popularpublishers():
    cur = mysql.connection.cursor()
    cur.execute(f'''select P.name, P.publisherID,
                    (select count(*) from Books B, Reviews R 
                        where B.publisherID = P.publisherID
                        and R.bookID = B.bookID
                    ) as ReviewsCount
                    from Publishers P
                    order by ReviewsCount desc
                    limit 3
                    ''')
    results = cur.fetchall()
    return jsonify(results)


#ADMIN ============================================================================================
# -- authors panel
@app.route('/api/admin/getauthors', methods=['GET'])
def admin_getauthors():
    cur = mysql.connection.cursor()
    cur.execute(f'''select * from Authors''')
    results = cur.fetchall()
    return jsonify(results)

@app.route('/api/admin/deleteauthors/<id>', methods=['GET'])
def admin_deleteauthors(id):
    cur = mysql.connection.cursor()
    cur.execute(f'''delete from Authors where authorID={id} ''')
    mysql.connection.commit()
    return 'done'

#update authors
@app.route('/api/admin/updateauthors', methods=['GET','POST'])
def admin_updateauthors():
    if request.method == 'POST':
        authorID = request.json['authorID']
        firstName = request.json['firstName']
        lastName = request.json['lastName']
        email = request.json['email']
        description = request.json['description']
        cur = mysql.connection.cursor()
        cur.execute(f'''update Authors
                        set firstName='{firstName}', lastName='{lastName}',
                        email='{email}', description='{description}'
                        where authorID={authorID};
                    ''')
        mysql.connection.commit()
        return 'done'
    else:
        return 

#add authors
@app.route('/api/admin/addauthors', methods=['GET','POST'])
def admin_addauthors():
    if request.method == 'POST':
        firstName = request.json['firstName']
        lastName = request.json['lastName']
        email = request.json['email']
        description = request.json['description']
        cur = mysql.connection.cursor()
        cur.execute(f'''insert into Authors
                        (firstName, lastName, email, description)
                        values ('{firstName}', '{lastName}', '{email}', '{description}')
                    ''')
        mysql.connection.commit()
        return 'done'
    else:
        return 

# -- publishers panel
@app.route('/api/admin/getpublishers', methods=['GET'])
def admin_getpublishers():
    cur = mysql.connection.cursor()
    cur.execute(f'''select * from Publishers''')
    results = cur.fetchall()
    return jsonify(results)

@app.route('/api/admin/deletepublishers/<id>', methods=['GET'])
def admin_deletepublishers(id):
    cur = mysql.connection.cursor()
    cur.execute(f'''delete from Publishers where publisherID={id} ''')
    mysql.connection.commit()
    return 'done'

#update publishers
@app.route('/api/admin/updatepublishers', methods=['GET','POST'])
def admin_updatepublishers():
    if request.method == 'POST':
        publisherID = request.json['publisherID']
        name = request.json['name']
        email = request.json['email']
        phone = request.json['phone']
        address = request.json['address']
        description = request.json['description']
        cur = mysql.connection.cursor()
        cur.execute(f'''update Publishers
                        set name='{name}', phone='{phone}',
                        email='{email}', description='{description}',
                        address='{address}'
                        where publisherID={publisherID};
                    ''')
        mysql.connection.commit()
        return 'done'
    else:
        return 

#add publishers
@app.route('/api/admin/addpublishers', methods=['GET','POST'])
def admin_addpublishers():
    if request.method == 'POST':
        name = request.json['name']
        email = request.json['email']
        phone = request.json['phone']
        address = request.json['address']
        description = request.json['description']
        cur = mysql.connection.cursor()
        cur.execute(f'''insert into Publishers
                        (name, email, phone, address, description)
                        values ('{name}', '{email}', '{phone}', '{address}', '{description}')
                    ''')
        mysql.connection.commit()
        return 'done'
    else:
        return 

# -- genres panel
@app.route('/api/admin/getgenres', methods=['GET'])
def admin_getgenres():
    cur = mysql.connection.cursor()
    cur.execute(f'''select * from Genres''')
    results = cur.fetchall()
    return jsonify(results)

@app.route('/api/admin/deletegenres/<id>', methods=['GET'])
def admin_deletegenres(id):
    cur = mysql.connection.cursor()
    cur.execute(f'''delete from Genres where genreID={id} ''')
    mysql.connection.commit()
    return 'done'

#update genres
@app.route('/api/admin/updategenres', methods=['GET','POST'])
def admin_updategenres():
    if request.method == 'POST':
        genreID = request.json['genreID']
        name = request.json['name']
        info = request.json['info']
        cur = mysql.connection.cursor()
        cur.execute(f'''update Genres
                        set name="{name}", info="{info}"
                        where genreID={genreID};
                    ''')
        mysql.connection.commit()
        return 'done'
    else:
        return 

#add publishers
@app.route('/api/admin/addgenres', methods=['GET','POST'])
def admin_addgenres():
    if request.method == 'POST':
        name = request.json['name']
        info = request.json['info']
        cur = mysql.connection.cursor()
        cur.execute(f'''insert into Genres
                        (name, info)
                        values ("{name}", "{info}")
                    ''')
        mysql.connection.commit()
        return 'done'
    else:
        return 

# -- books panel
@app.route('/api/admin/getbooks', methods=['GET'])
def admin_getbooks():
    cur = mysql.connection.cursor()
    cur.execute(f'''select B.*,
                    (select GROUP_CONCAT(CONCAT(A.firstName, " ", A.lastName) SEPARATOR ', ')
                            from Authors A, AuthorBond AB
                            where B.bookID = AB.bookID and AB.authorID = A.authorID)
                    as authors,
                    (select GROUP_CONCAT(G.name SEPARATOR ', ')
                            from Genres G, GenresBond GB
                            where G.genreID = GB.genreID and GB.bookID = B.bookID)
                    as genres,
                    (select P.name from Publishers P where B.publisherID = P.publisherID)
                    as publisherName
                    from Books B
                    ''')
    results = cur.fetchall()
    return jsonify(results)

#delete books
@app.route('/api/admin/deletebooks/<id>', methods=['GET'])
def admin_deletebooks(id):
    cur = mysql.connection.cursor()
    cur.execute(f'''delete from Books where bookID={id} ''')
    mysql.connection.commit()
    return 'done'

#add books
@app.route('/api/admin/addbooks', methods=['GET','POST'])
def admin_addbooks():
    if request.method == 'POST':
        publisherID = request.json['publisherID']
        title = request.json['title']
        description = request.json['description']
        date = request.json['date']
        isDigital = request.json['isDigital']
        price = request.json['price']
        pages = request.json['pages']
        cur = mysql.connection.cursor()
        cur.execute(f'''insert into Books
                        (publisherID, title, description, date, isDigital, price, pages)
                        values ('{publisherID}', "{title}", "{description}",'{date}','{isDigital}','{price}','{pages}')
                    ''')
        mysql.connection.commit()

        cur = mysql.connection.cursor()
        cur.execute(f'''select * from Books order by bookID desc limit 1''')
        results = cur.fetchall()
        return jsonify(results)
    else:
        return 

#creates book to authors bond
@app.route('/api/admin/authorbond/<bookID>/<authorID>', methods=['GET'])
def admin_authorsbond(bookID, authorID):
    cur = mysql.connection.cursor()
    cur.execute(f'''insert into AuthorBond (bookID, authorID)
                    values('{bookID}','{authorID}')
                ''')
    mysql.connection.commit()
    return 'done'

#creates book to genre bond
@app.route('/api/admin/genrebond/<bookID>/<genreID>', methods=['GET'])
def admin_genresbond(bookID, genreID):
    cur = mysql.connection.cursor()
    cur.execute(f'''insert into GenresBond (bookID, genreID)
                    values('{bookID}','{genreID}')
                ''')
    mysql.connection.commit()
    return 'done'


