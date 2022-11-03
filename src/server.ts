import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import fs from "fs";
import path from "path";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url: imageUrl } = req.query;

    // validate image url
    if (imageUrl == null) {
      res.status(400).json({ message: "image_url is required" });
      return;
    }

    const image = await filterImageFromURL(imageUrl);

    res.sendFile(image, () => {
      const tempFiles = fs.readdirSync(path.join(__dirname, "util", "tmp"));

      const getAbsoluteFilepath = (filePath: string) =>
        path.resolve(path.join(filePath));

      const localFiles = tempFiles.map((fileName) =>
        getAbsoluteFilepath(path.join(__dirname, "util", "tmp", fileName))
      );

      deleteLocalFiles(localFiles);
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
