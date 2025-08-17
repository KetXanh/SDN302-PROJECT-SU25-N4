const ensureAdmin = (req, res, next) => {
    if (req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
}

const ensureTeacher = (req, res, next) => {
    if (req.user.role === 'Teacher' || req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
}

const ensureStudent = (req, res, next) => {
    if (req.user.role === 'Student') {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
}

module.exports = { ensureAdmin, ensureTeacher, ensureStudent };