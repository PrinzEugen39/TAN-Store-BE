class APIFeatures {
  query: any;
  queryString: any;
  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (queryObj.name !== undefined) {
      const nameRegex = queryObj.name.trim();
      if (nameRegex !== "") {
        queryObj.name = { $regex: nameRegex, $options: "i" };
      } else {
        delete queryObj.name;
      }
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString && this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt _id");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(",")
        .join(" ")
        .replace(/password/g, "");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page);
    const limit = Number(this.queryString.limit);
    const skip = (page - 1) * limit;
    // page=3&limit=10 1-10, 11-20, 21-30
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
