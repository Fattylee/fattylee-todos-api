const filePath = (dir, path) => {
  return (
    dir.includes('\\') ? path.replace(/\//g, '\\') : path
  );
}

module.exports = {
  filePath,
}