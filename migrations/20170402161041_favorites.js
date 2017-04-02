exports.up = function(knex) {
    return knex.schema.createTable('favorites', (table) => {
        table.increments();
        table.integer('book_id').notNullable().references('id').inTable('books').onDelete('CASCADE');
        table.index('book_id');
        table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.index('user_id');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('favorites')
};
